"""
Vistas para generación de reportes académicos
- Reporte de notas en Excel
- Boletines estudiantiles en PDF
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from io import BytesIO
import zipfile
from datetime import datetime

try:
    from openpyxl import Workbook
    from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
except ImportError:
    Workbook = None

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

from .models_db import (
    Estudiantes, Cursos, Materias, Periodo, EstudianteNotas,
    Estudiantes_cursos, Definitivas, MateriasAsignadas
)
from django.db.models import Avg, Count, Q


class GenerarReporteNotasExcelView(APIView):
    """
    Genera un reporte de notas en formato Excel
    Parámetros:
    - periodo: ID del periodo académico (requerido)
    - curso: ID del curso (opcional, si no se envía genera para todos)
    - materia: ID de la materia (opcional)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if Workbook is None:
            return Response({
                'error': 'openpyxl no está instalado. Instala con: pip install openpyxl'
            }, status=500)

        periodo_id = request.query_params.get('periodo')
        curso_id = request.query_params.get('curso')
        materia_id = request.query_params.get('materia')

        if not periodo_id:
            return Response({
                'error': 'El parámetro "periodo" es requerido'
            }, status=400)

        try:
            periodo = Periodo.objects.get(id_periodo=periodo_id)
        except Periodo.DoesNotExist:
            return Response({'error': 'Periodo no encontrado'}, status=404)

        # Crear workbook
        wb = Workbook()
        wb.remove(wb.active)  # Remover hoja por defecto

        # Estilos
        header_fill = PatternFill(start_color="D32F2F", end_color="D32F2F", fill_type="solid")
        header_font = Font(bold=True, color="FFFFFF", size=12)
        title_font = Font(bold=True, size=14, color="D32F2F")
        
        # Colores para notas
        aprobado_fill = PatternFill(start_color="E8F5E9", end_color="E8F5E9", fill_type="solid")
        aprobado_font = Font(color="2E7D32", bold=True)
        reprobado_fill = PatternFill(start_color="FFEBEE", end_color="FFEBEE", fill_type="solid")
        reprobado_font = Font(color="D32F2F", bold=True)
        aceptable_fill = PatternFill(start_color="FFF9C4", end_color="FFF9C4", fill_type="solid")
        aceptable_font = Font(color="F57F17", bold=True)
        
        border = Border(
            left=Side(style='thin'),
            right=Side(style='thin'),
            top=Side(style='thin'),
            bottom=Side(style='thin')
        )
        center_alignment = Alignment(horizontal='center', vertical='center')

        # Determinar cursos a procesar
        if curso_id:
            cursos = Cursos.objects.filter(id_curso=curso_id)
        else:
            cursos = Cursos.objects.all().order_by('nombre')

        # Hoja 1: Resumen General
        ws_resumen = wb.create_sheet("Resumen General")
        
        # Título principal
        periodo_titulo = periodo.nombre or f"Periodo {periodo.id_periodo}"
        ws_resumen.append([f"REPORTE DE NOTAS - {periodo_titulo.upper()}"])
        ws_resumen['A1'].font = title_font
        ws_resumen['A1'].alignment = center_alignment
        ws_resumen.merge_cells('A1:C1')
        
        ws_resumen.append([f"Fecha de generación: {datetime.now().strftime('%Y-%m-%d %H:%M')}"])
        ws_resumen['A2'].alignment = center_alignment
        ws_resumen.merge_cells('A2:C2')
        
        ws_resumen.append([])
        ws_resumen.append(["Grado", "Total Estudiantes", "Promedio General"])
        
        for curso in cursos:
            estudiantes_curso = Estudiantes_cursos.objects.filter(
                id_curso=curso,
                estado='activo'
            ).count()
            
            # Calcular promedio del curso
            definitivas = Definitivas.objects.filter(
                fk_id_estudiantes_cursos__id_curso=curso,
                fk_id_periodo__id_periodo=periodo_id
            )
            
            promedio = definitivas.aggregate(Avg('valor_definitiva'))['valor_definitiva__avg'] or 0
            
            ws_resumen.append([
                curso.nombre,
                estudiantes_curso,
                f"{promedio:.2f}"
            ])

        # Aplicar estilos al resumen
        for row in ws_resumen.iter_rows(min_row=4, max_row=4):
            for cell in row:
                cell.fill = header_fill
                cell.font = header_font
                cell.alignment = Alignment(horizontal='center')

        # Ajustar anchos de columna automáticamente en resumen
        for col_idx in range(1, 4):  # Solo 3 columnas en resumen
            max_length = 0
            column_letter = chr(64 + col_idx)
            
            # Recorrer las celdas de la columna (empezando desde la fila 4, después del encabezado)
            for row_idx in range(4, ws_resumen.max_row + 1):
                cell = ws_resumen.cell(row=row_idx, column=col_idx)
                try:
                    if cell.value:
                        max_length = max(max_length, len(str(cell.value)))
                except:
                    pass
            
            adjusted_width = min(max_length + 2, 50)  # Máximo 50 caracteres
            ws_resumen.column_dimensions[column_letter].width = max(adjusted_width, 15)  # Mínimo 15

        # Crear hoja por cada curso
        for curso in cursos:
            ws = wb.create_sheet(curso.nombre[:31])  # Excel limita a 31 caracteres
            
            # Obtener estudiantes del curso
            estudiantes_curso = Estudiantes_cursos.objects.filter(
                id_curso=curso,
                estado='activo'
            ).select_related('numero_documento_estudiante')
            
            if not estudiantes_curso.exists():
                ws.append(["No hay estudiantes registrados en este curso"])
                continue
            
            # Obtener materias del curso
            if materia_id:
                materias = Materias.objects.filter(id_materia=materia_id)
            else:
                materias_asignadas = MateriasAsignadas.objects.filter(
                    fk_id_curso=curso
                ).values_list('fk_id_materia', flat=True).distinct()
                materias = Materias.objects.filter(id_materia__in=materias_asignadas).order_by('nombre')
            
            # Encabezados
            headers = ["Documento", "Nombre Completo"]
            for materia in materias:
                headers.append(materia.nombre)
            headers.append("Promedio General")
            
            # Título con merge correcto
            ws.append([f"NOTAS - {curso.nombre} - {periodo_titulo.upper()}"])
            ws['A1'].font = title_font
            ws['A1'].alignment = center_alignment
            last_col_letter = chr(64 + len(headers))  # Calcular letra de última columna
            ws.merge_cells(f'A1:{last_col_letter}1')
            ws.append([])
            
            ws.append(headers)
            
            # Aplicar estilo a encabezados
            for cell in ws[3]:
                cell.fill = header_fill
                cell.font = header_font
                cell.alignment = Alignment(horizontal='center')
                cell.border = border
            
            # Datos de estudiantes
            for est_curso in estudiantes_curso:
                estudiante = est_curso.numero_documento_estudiante
                row_data = [
                    estudiante.numero_documento_estudiante,
                    estudiante.nombre_completo
                ]
                
                notas_materias = []
                for materia in materias:
                    # Buscar definitiva
                    definitiva = Definitivas.objects.filter(
                        fk_id_estudiantes_cursos=est_curso,
                        fk_id_materia=materia,
                        fk_id_periodo__id_periodo=periodo_id
                    ).first()
                    
                    if definitiva:
                        nota = float(definitiva.valor_definitiva)
                        notas_materias.append(nota)
                        row_data.append(nota)
                    else:
                        row_data.append(0.0)
                        notas_materias.append(0.0)
                
                # Calcular promedio
                promedio = sum(notas_materias) / len(notas_materias) if notas_materias else 0
                row_data.append(promedio)
                
                # Agregar fila
                row_num = ws.max_row + 1
                ws.append(row_data)
                
                # Aplicar formato condicional a las notas
                for col_idx, nota in enumerate(notas_materias, start=3):
                    cell = ws.cell(row=row_num, column=col_idx)
                    cell.number_format = '0.00'
                    
                    if nota >= 4.0:
                        cell.fill = aprobado_fill
                        cell.font = aprobado_font
                    elif nota >= 3.0:
                        cell.fill = aceptable_fill
                        cell.font = aceptable_font
                    elif nota > 0:
                        cell.fill = reprobado_fill
                        cell.font = reprobado_font
                
                # Aplicar formato al promedio
                promedio_cell = ws.cell(row=row_num, column=len(headers))
                promedio_cell.number_format = '0.00'
                promedio_cell.font = Font(bold=True)
                
                if promedio >= 4.0:
                    promedio_cell.fill = aprobado_fill
                    promedio_cell.font = Font(color="2E7D32", bold=True)
                elif promedio >= 3.0:
                    promedio_cell.fill = aceptable_fill
                    promedio_cell.font = Font(color="F57F17", bold=True)
                elif promedio > 0:
                    promedio_cell.fill = reprobado_fill
                    promedio_cell.font = Font(color="D32F2F", bold=True)
            
            # Ajustar anchos de columna automáticamente
            for col_idx in range(1, len(headers) + 1):
                max_length = 0
                column_letter = chr(64 + col_idx)  # A=65, B=66, etc.
                
                # Recorrer las celdas de la columna (empezando desde la fila 3, después del título)
                for row_idx in range(3, ws.max_row + 1):
                    cell = ws.cell(row=row_idx, column=col_idx)
                    try:
                        if cell.value:
                            cell_length = len(str(cell.value))
                            max_length = max(max_length, cell_length)
                    except:
                        pass
                
                # Ajustar ancho con un mínimo y máximo
                if col_idx == 1:  # Columna de documento
                    adjusted_width = max(15, min(max_length + 2, 20))
                elif col_idx == 2:  # Columna de nombre
                    adjusted_width = max(30, min(max_length + 2, 40))
                else:  # Columnas de materias y promedio
                    adjusted_width = max(12, min(max_length + 2, 25))
                
                ws.column_dimensions[column_letter].width = adjusted_width
            
            # Aplicar bordes a todas las celdas con datos
            for row in ws.iter_rows(min_row=3, max_row=ws.max_row, min_col=1, max_col=len(headers)):
                for cell in row:
                    cell.border = border
                    if cell.column > 2:  # Columnas de notas y promedio
                        cell.alignment = Alignment(horizontal='center')

        # Generar respuesta
        output = BytesIO()
        wb.save(output)
        output.seek(0)
        
        filename = f"Reporte_Notas_Periodo_{periodo_id}_{datetime.now().strftime('%Y%m%d')}.xlsx"
        
        response = HttpResponse(
            output.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


class GenerarBoletinPDFView(APIView):
    """
    Genera boletín(es) en PDF
    Parámetros:
    - estudiante: Documento del estudiante (opcional)
    - curso: ID del curso para generar todos los boletines del curso (opcional)
    - periodo: ID del periodo académico (requerido)
    - formato: 'individual' o 'lote' (default: 'individual')
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not REPORTLAB_AVAILABLE:
            return Response({
                'error': 'reportlab no está instalado. Instala con: pip install reportlab'
            }, status=500)

        estudiante_doc = request.query_params.get('estudiante')
        curso_id = request.query_params.get('curso')
        periodo_id = request.query_params.get('periodo')
        formato = request.query_params.get('formato', 'individual')

        if not periodo_id:
            return Response({'error': 'El parámetro "periodo" es requerido'}, status=400)

        try:
            periodo = Periodo.objects.get(id_periodo=periodo_id)
        except Periodo.DoesNotExist:
            return Response({'error': 'Periodo no encontrado'}, status=404)

        # Determinar estudiantes a procesar
        if estudiante_doc:
            try:
                estudiante = Estudiantes.objects.get(numero_documento_estudiante=estudiante_doc)
                estudiantes = [estudiante]
            except Estudiantes.DoesNotExist:
                return Response({'error': 'Estudiante no encontrado'}, status=404)
        elif curso_id:
            try:
                curso = Cursos.objects.get(id_curso=curso_id)
                estudiantes_curso = Estudiantes_cursos.objects.filter(
                    id_curso=curso,
                    estado='activo'
                ).select_related('numero_documento_estudiante')
                estudiantes = [ec.numero_documento_estudiante for ec in estudiantes_curso]
            except Cursos.DoesNotExist:
                return Response({'error': 'Curso no encontrado'}, status=404)
        else:
            return Response({
                'error': 'Debe proporcionar "estudiante" o "curso"'
            }, status=400)

        if formato == 'lote' and len(estudiantes) > 1:
            # Generar ZIP con múltiples PDFs
            return self._generar_zip_boletines(estudiantes, periodo)
        else:
            # Generar PDF individual
            if len(estudiantes) == 0:
                return Response({'error': 'No hay estudiantes para generar boletín'}, status=404)
            return self._generar_boletin_individual(estudiantes[0], periodo)

    def _generar_boletin_individual(self, estudiante, periodo):
        """Genera un boletín individual en PDF"""
        buffer = BytesIO()
        pdf = self._crear_boletin_pdf(buffer, estudiante, periodo)
        buffer.seek(0)
        
        filename = f"Boletin_{estudiante.numero_documento_estudiante}_{estudiante.nombre1}_{estudiante.apellido1}_P{periodo.id_periodo}.pdf"
        
        response = HttpResponse(buffer.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response

    def _generar_zip_boletines(self, estudiantes, periodo):
        """Genera un ZIP con múltiples boletines"""
        zip_buffer = BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for estudiante in estudiantes:
                pdf_buffer = BytesIO()
                self._crear_boletin_pdf(pdf_buffer, estudiante, periodo)
                pdf_buffer.seek(0)
                
                filename = f"{estudiante.numero_documento_estudiante}_{estudiante.nombre1}_{estudiante.apellido1}.pdf"
                zip_file.writestr(filename, pdf_buffer.read())
        
        zip_buffer.seek(0)
        
        # Obtener nombre del curso si aplica
        est_curso = Estudiantes_cursos.objects.filter(
            numero_documento_estudiante=estudiantes[0],
            estado='activo'
        ).first()
        
        curso_nombre = est_curso.id_curso.nombre if est_curso else "Estudiantes"
        filename = f"Boletines_{curso_nombre}_Periodo_{periodo.id_periodo}_{datetime.now().strftime('%Y%m%d')}.zip"
        
        response = HttpResponse(zip_buffer.read(), content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response

    def _crear_boletin_pdf(self, buffer, estudiante, periodo):
        """Crea el contenido del boletín en PDF"""
        doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
        elements = []
        styles = getSampleStyleSheet()
        
        # Estilos personalizados
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#D32F2F'),
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Normal'],
            fontSize=12,
            spaceAfter=12,
            alignment=TA_CENTER
        )
        
        # Título
        elements.append(Paragraph("BOLETÍN ACADÉMICO", title_style))
        elements.append(Paragraph(periodo.nombre or f"Periodo {periodo.id_periodo}", subtitle_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Información del estudiante
        est_curso = Estudiantes_cursos.objects.filter(
            numero_documento_estudiante=estudiante,
            estado='activo'
        ).select_related('id_curso').first()
        
        info_data = [
            ["Estudiante:", estudiante.nombre_completo],
            ["Documento:", estudiante.numero_documento_estudiante],
            ["Grado:", est_curso.id_curso.nombre if est_curso else "N/A"],
            ["Periodo:", f"{periodo.nombre or f'Periodo {periodo.id_periodo}'} ({periodo.fecha_inicio} - {periodo.fecha_fin})"]
        ]
        
        info_table = Table(info_data, colWidths=[2*inch, 4*inch])
        info_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(info_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Tabla de notas
        elements.append(Paragraph("CALIFICACIONES", styles['Heading2']))
        elements.append(Spacer(1, 0.1*inch))
        
        # Obtener definitivas del estudiante
        if est_curso:
            definitivas = Definitivas.objects.filter(
                fk_id_estudiantes_cursos=est_curso,
                fk_id_periodo=periodo
            ).select_related('fk_id_materia').order_by('fk_id_materia__nombre')
            
            notas_data = [["Materia", "Calificación", "Estado"]]
            total_notas = []
            
            for definitiva in definitivas:
                nota = float(definitiva.valor_definitiva)
                total_notas.append(nota)
                estado = "Aprobado" if nota >= 3.0 else "Reprobado"
                notas_data.append([
                    definitiva.fk_id_materia.nombre,
                    f"{nota:.2f}",
                    estado
                ])
            
            # Promedio
            promedio = sum(total_notas) / len(total_notas) if total_notas else 0
            notas_data.append(["", "", ""])
            notas_data.append(["PROMEDIO GENERAL", f"{promedio:.2f}", "Aprobado" if promedio >= 3.0 else "Reprobado"])
            
            notas_table = Table(notas_data, colWidths=[3.5*inch, 1.5*inch, 1.5*inch])
            notas_table.setStyle(TableStyle([
                # Encabezado
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#D32F2F')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                # Contenido
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 10),
                ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
                ('GRID', (0, 0), (-1, -2), 1, colors.grey),
                # Fila de promedio
                ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#FFEBEE')),
                ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
                ('LINEABOVE', (0, -1), (-1, -1), 2, colors.HexColor('#D32F2F')),
            ]))
            elements.append(notas_table)
        else:
            elements.append(Paragraph("No hay calificaciones registradas", styles['Normal']))
        
        elements.append(Spacer(1, 0.5*inch))
        
        # Observaciones
        elements.append(Paragraph("OBSERVACIONES:", styles['Heading3']))
        elements.append(Spacer(1, 0.1*inch))
        elements.append(Paragraph("_" * 80, styles['Normal']))
        elements.append(Spacer(1, 0.1*inch))
        elements.append(Paragraph("_" * 80, styles['Normal']))
        
        elements.append(Spacer(1, 0.5*inch))
        
        # Firmas
        firmas_data = [
            ["_" * 25, "_" * 25, "_" * 25],
            ["Director(a)", "Coordinador(a)", "Acudiente"]
        ]
        firmas_table = Table(firmas_data, colWidths=[2*inch, 2*inch, 2*inch])
        firmas_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('FONTNAME', (0, 1), (-1, 1), 'Helvetica-Bold'),
        ]))
        elements.append(firmas_table)
        
        # Construir PDF
        doc.build(elements)
        return buffer
