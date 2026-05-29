"""
Vistas para el módulo de estadísticas del sistema académico
Proporciona endpoints para obtener datos estadísticos demográficos, académicos e institucionales
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Avg, Q, Max, Min, F
from django.db.models.functions import Coalesce
from .models_db import (
    Estudiantes, Profesores, Cursos, Materias, EstudianteNotas,
    Genero, TipoSangre, Sisben, Discapacidad, Alergia,
    Ciudad, Departamento, Area_conocimiento, Definitivas,
    Estudiantes_cursos, MateriasAsignadas, TipoEstado, Periodo
)
from datetime import datetime, date


class EstadisticasGeneralesView(APIView):
    """
    Endpoint para obtener estadísticas generales del sistema
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Contadores generales
            total_estudiantes = Estudiantes.objects.count()
            total_estudiantes_activos = Estudiantes.objects.filter(
                fk_tipo_estado__descripcion__iexact='activo'
            ).count()
            total_profesores = Profesores.objects.count()
            total_profesores_activos = Profesores.objects.filter(
                fk_id_estado__descripcion__iexact='activo'
            ).count()
            total_cursos = Cursos.objects.filter(estado__iexact='activo').count()
            total_materias = Materias.objects.filter(estado__iexact='activo').count()

            # Promedio general de calificaciones
            promedio_general = EstudianteNotas.objects.aggregate(
                promedio=Avg('calificacion')
            )['promedio'] or 0

            # Tasa de aprobación (calificaciones >= 3.0)
            total_notas = EstudianteNotas.objects.count()
            notas_aprobadas = EstudianteNotas.objects.filter(calificacion__gte=3.0).count()
            tasa_aprobacion = (notas_aprobadas / total_notas * 100) if total_notas > 0 else 0

            data = {
                'totales': {
                    'estudiantes': total_estudiantes,
                    'estudiantes_activos': total_estudiantes_activos,
                    'profesores': total_profesores,
                    'profesores_activos': total_profesores_activos,
                    'cursos': total_cursos,
                    'materias': total_materias,
                },
                'academico': {
                    'promedio_general': round(float(promedio_general), 2),
                    'tasa_aprobacion': round(tasa_aprobacion, 2),
                    'total_calificaciones': total_notas,
                }
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Error al obtener estadísticas generales: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EstadisticasDemograficasView(APIView):
    """
    Endpoint para obtener estadísticas demográficas de estudiantes
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Distribución por género
            distribucion_genero = list(
                Estudiantes.objects.values('fk_id_genero__descripcion')
                .annotate(cantidad=Count('numero_documento_estudiante'))
                .order_by('-cantidad')
            )

            # Distribución por tipo de sangre
            distribucion_sangre = list(
                Estudiantes.objects.values('fk_id_tipo_sangre__descripcion')
                .annotate(cantidad=Count('numero_documento_estudiante'))
                .order_by('-cantidad')
            )

            # Distribución por Sisben
            distribucion_sisben = list(
                Estudiantes.objects.values('fk_id_tipo_sisben__descripcion')
                .annotate(cantidad=Count('numero_documento_estudiante'))
                .order_by('-cantidad')
            )

            # Distribución por discapacidad
            distribucion_discapacidad = list(
                Estudiantes.objects.values('fk_id_tipo_discapacidad__descripcion')
                .annotate(cantidad=Count('numero_documento_estudiante'))
                .order_by('-cantidad')
            )

            # Distribución por alergia
            distribucion_alergia = list(
                Estudiantes.objects.values('fk_id_tipo_alergia__descripcion')
                .annotate(cantidad=Count('numero_documento_estudiante'))
                .order_by('-cantidad')
            )

            # Distribución por edad (rangos)
            estudiantes_con_edad = Estudiantes.objects.exclude(edad__isnull=True)
            rangos_edad = {
                '0-5': estudiantes_con_edad.filter(edad__lte=5).count(),
                '6-10': estudiantes_con_edad.filter(edad__gte=6, edad__lte=10).count(),
                '11-15': estudiantes_con_edad.filter(edad__gte=11, edad__lte=15).count(),
                '16-18': estudiantes_con_edad.filter(edad__gte=16, edad__lte=18).count(),
                '19+': estudiantes_con_edad.filter(edad__gte=19).count(),
            }

            # Distribución geográfica por departamento
            distribucion_geografica = list(
                Estudiantes.objects.values(
                    'fk_codigo_municipio__fk_codigo_departamento__nombre'
                )
                .annotate(cantidad=Count('numero_documento_estudiante'))
                .order_by('-cantidad')[:10]  # Top 10 departamentos
            )

            # Top 10 ciudades con más estudiantes
            top_ciudades = list(
                Estudiantes.objects.values('fk_codigo_municipio__nombre')
                .annotate(cantidad=Count('numero_documento_estudiante'))
                .order_by('-cantidad')[:10]
            )

            data = {
                'genero': distribucion_genero,
                'tipo_sangre': distribucion_sangre,
                'sisben': distribucion_sisben,
                'discapacidad': distribucion_discapacidad,
                'alergia': distribucion_alergia,
                'rangos_edad': rangos_edad,
                'departamentos': distribucion_geografica,
                'top_ciudades': top_ciudades,
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Error al obtener estadísticas demográficas: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EstadisticasAcademicasView(APIView):
    """
    Endpoint para obtener estadísticas académicas
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Parámetros opcionales de filtro
            periodo_id = request.query_params.get('periodo_id', None)
            curso_id = request.query_params.get('curso_id', None)

            # Distribución de calificaciones por rangos
            notas_query = EstudianteNotas.objects.all()
            
            if periodo_id:
                notas_query = notas_query.filter(
                    fk_id_actividad__fk_id_ra__fk_id_periodo_academico_id=periodo_id
                )

            distribucion_calificaciones = {
                'Excelente (4.5-5.0)': notas_query.filter(calificacion__gte=4.5).count(),
                'Sobresaliente (4.0-4.4)': notas_query.filter(calificacion__gte=4.0, calificacion__lt=4.5).count(),
                'Aceptable (3.5-3.9)': notas_query.filter(calificacion__gte=3.5, calificacion__lt=4.0).count(),
                'Aprobado (3.0-3.4)': notas_query.filter(calificacion__gte=3.0, calificacion__lt=3.5).count(),
                'Insuficiente (0-2.9)': notas_query.filter(calificacion__lt=3.0).count(),
            }

            # Rendimiento por materia (promedio)
            rendimiento_materias = list(
                EstudianteNotas.objects.values(
                    'fk_id_actividad__fk_id_ra__fk_id_materia_profesores__fk_id_materia__nombre'
                )
                .annotate(
                    promedio=Avg('calificacion'),
                    total_notas=Count('id_estudiante_notas')
                )
                .order_by('-promedio')[:10]
            )

            # Rendimiento por curso
            rendimiento_cursos = []
            cursos = Cursos.objects.filter(estado__iexact='activo')
            
            for curso in cursos:
                # Obtener estudiantes del curso
                estudiantes_curso = Estudiantes_cursos.objects.filter(
                    id_curso=curso,
                    estado__iexact='activo'
                ).values_list('numero_documento_estudiante', flat=True)

                if estudiantes_curso:
                    # Calcular promedio de notas de esos estudiantes
                    promedio = EstudianteNotas.objects.filter(
                        fk_numero_documento_estudiante__in=estudiantes_curso
                    ).aggregate(promedio=Avg('calificacion'))['promedio']

                    if promedio:
                        rendimiento_cursos.append({
                            'curso': curso.nombre,
                            'promedio': round(float(promedio), 2),
                            'total_estudiantes': len(estudiantes_curso)
                        })

            rendimiento_cursos.sort(key=lambda x: x['promedio'], reverse=True)

            # Top 10 estudiantes con mejor promedio
            top_estudiantes = []
            estudiantes = Estudiantes.objects.all()[:100]  # Limitar para performance
            
            for estudiante in estudiantes:
                promedio = EstudianteNotas.objects.filter(
                    fk_numero_documento_estudiante=estudiante
                ).aggregate(promedio=Avg('calificacion'))['promedio']

                if promedio:
                    top_estudiantes.append({
                        'numero_documento': estudiante.numero_documento_estudiante,
                        'nombre_completo': estudiante.nombre_completo,
                        'promedio': round(float(promedio), 2)
                    })

            top_estudiantes.sort(key=lambda x: x['promedio'], reverse=True)
            top_estudiantes = top_estudiantes[:10]

            # Materias con mayor tasa de reprobación
            materias_reprobacion = []
            materias = Materias.objects.filter(estado__iexact='activo')
            
            for materia in materias:
                notas_materia = EstudianteNotas.objects.filter(
                    fk_id_actividad__fk_id_ra__fk_id_materia_profesores__fk_id_materia=materia
                )
                total = notas_materia.count()
                
                if total > 0:
                    reprobadas = notas_materia.filter(calificacion__lt=3.0).count()
                    tasa_reprobacion = (reprobadas / total) * 100
                    
                    materias_reprobacion.append({
                        'materia': materia.nombre,
                        'tasa_reprobacion': round(tasa_reprobacion, 2),
                        'total_evaluaciones': total
                    })

            materias_reprobacion.sort(key=lambda x: x['tasa_reprobacion'], reverse=True)
            materias_reprobacion = materias_reprobacion[:10]

            data = {
                'distribucion_calificaciones': distribucion_calificaciones,
                'rendimiento_materias': rendimiento_materias,
                'rendimiento_cursos': rendimiento_cursos,
                'top_estudiantes': top_estudiantes,
                'materias_mayor_reprobacion': materias_reprobacion,
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Error al obtener estadísticas académicas: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EstadisticasInstitucionalesView(APIView):
    """
    Endpoint para obtener estadísticas institucionales
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Estudiantes por curso
            estudiantes_por_curso = list(
                Estudiantes_cursos.objects.filter(estado__iexact='activo')
                .values('id_curso__nombre')
                .annotate(cantidad=Count('numero_documento_estudiante'))
                .order_by('id_curso__nombre')
            )

            # Profesores por área de conocimiento
            profesores_por_area = list(
                MateriasAsignadas.objects.values(
                    'fk_id_materia__fk_Id_area_conocimiento__nombre'
                )
                .annotate(cantidad=Count('fk_numero_documento_profesor', distinct=True))
                .order_by('-cantidad')
            )

            # Materias por área de conocimiento
            materias_por_area = list(
                Materias.objects.filter(estado__iexact='activo')
                .values('fk_Id_area_conocimiento__nombre')
                .annotate(cantidad=Count('id_materia'))
                .order_by('-cantidad')
            )

            # Carga académica por profesor (número de materias asignadas)
            carga_profesores = list(
                MateriasAsignadas.objects.values(
                    'fk_numero_documento_profesor__nombre1',
                    'fk_numero_documento_profesor__apellido1'
                )
                .annotate(
                    total_materias=Count('id_materia_profesores'),
                    total_cursos=Count('fk_id_curso', distinct=True)
                )
                .order_by('-total_materias')[:15]
            )

            # Evolución de estudiantes por estado
            estudiantes_por_estado = list(
                Estudiantes.objects.values('fk_tipo_estado__descripcion')
                .annotate(cantidad=Count('numero_documento_estudiante'))
                .order_by('-cantidad')
            )

            # Distribución de estudiantes por año electivo
            estudiantes_por_anio = list(
                Estudiantes_cursos.objects.values(
                    'id_curso__fk_id_año_electivo__id_año_electivo'
                )
                .annotate(cantidad=Count('numero_documento_estudiante', distinct=True))
                .order_by('id_curso__fk_id_año_electivo__id_año_electivo')
            )

            data = {
                'estudiantes_por_curso': estudiantes_por_curso,
                'profesores_por_area': profesores_por_area,
                'materias_por_area': materias_por_area,
                'carga_profesores': carga_profesores,
                'estudiantes_por_estado': estudiantes_por_estado,
                'estudiantes_por_anio': estudiantes_por_anio,
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Error al obtener estadísticas institucionales: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EstadisticasComparativasView(APIView):
    """
    Endpoint para obtener estadísticas comparativas entre periodos
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Obtener todos los periodos
            periodos = Periodo.objects.all().order_by('id_periodo')

            comparativa_periodos = []
            
            for periodo in periodos:
                # Calcular promedio del periodo
                promedio = EstudianteNotas.objects.filter(
                    fk_id_actividad__fk_id_ra__fk_id_periodo_academico=periodo
                ).aggregate(promedio=Avg('calificacion'))['promedio']

                # Calcular tasa de aprobación
                total_notas = EstudianteNotas.objects.filter(
                    fk_id_actividad__fk_id_ra__fk_id_periodo_academico=periodo
                ).count()
                
                aprobadas = EstudianteNotas.objects.filter(
                    fk_id_actividad__fk_id_ra__fk_id_periodo_academico=periodo,
                    calificacion__gte=3.0
                ).count()

                tasa_aprobacion = (aprobadas / total_notas * 100) if total_notas > 0 else 0

                comparativa_periodos.append({
                    'periodo': periodo.nombre or f'Periodo {periodo.id_periodo}',
                    'promedio': round(float(promedio), 2) if promedio else 0,
                    'tasa_aprobacion': round(tasa_aprobacion, 2),
                    'total_evaluaciones': total_notas
                })

            data = {
                'comparativa_periodos': comparativa_periodos
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Error al obtener estadísticas comparativas: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FiltrosDisponiblesView(APIView):
    """
    Endpoint para obtener los filtros disponibles (periodos, cursos, materias)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            periodos = list(
                Periodo.objects.all().values('id_periodo', 'fecha_inicio', 'fecha_fin')
                .order_by('id_periodo')
            )

            cursos = list(
                Cursos.objects.filter(estado__iexact='activo')
                .values('id_curso', 'nombre')
                .order_by('nombre')
            )

            materias = list(
                Materias.objects.filter(estado__iexact='activo')
                .values('id_materia', 'nombre')
                .order_by('nombre')
            )

            areas = list(
                Area_conocimiento.objects.all()
                .values('id_area_conocimiento', 'nombre')
                .order_by('nombre')
            )

            data = {
                'periodos': periodos,
                'cursos': cursos,
                'materias': materias,
                'areas_conocimiento': areas
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Error al obtener filtros: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
