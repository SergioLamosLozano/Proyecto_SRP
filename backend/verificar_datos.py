"""
Script para verificar los datos en la base de datos
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_srp.settings')
django.setup()

from core.models_db import Estudiantes, EstudianteNotas, Actividades, RA, MateriasAsignadas, Materias

def verificar_datos():
    print("=" * 80)
    print("VERIFICACIÓN DE DATOS EN LA BASE DE DATOS")
    print("=" * 80)
    
    # Verificar estudiantes
    estudiantes = Estudiantes.objects.all()
    print(f"\n📚 Total de estudiantes: {estudiantes.count()}")
    if estudiantes.exists():
        print("Primeros 5 estudiantes:")
        for est in estudiantes[:5]:
            print(f"  - {est.numero_documento_estudiante}: {est.nombre_completo}")
    
    # Verificar materias
    materias = Materias.objects.all()
    print(f"\n📖 Total de materias: {materias.count()}")
    if materias.exists():
        print("Primeras 5 materias:")
        for mat in materias[:5]:
            print(f"  - {mat.id_materia}: {mat.nombre}")
    
    # Verificar materias asignadas
    materias_asignadas = MateriasAsignadas.objects.all()
    print(f"\n👨‍🏫 Total de materias asignadas: {materias_asignadas.count()}")
    if materias_asignadas.exists():
        print("Primeras 5 asignaciones:")
        for ma in materias_asignadas[:5]:
            print(f"  - Materia: {ma.fk_id_materia.nombre}, Curso: {ma.fk_id_curso.nombre}")
    
    # Verificar RAs
    ras = RA.objects.all()
    print(f"\n🎯 Total de Resultados de Aprendizaje: {ras.count()}")
    if ras.exists():
        print("Primeros 5 RAs:")
        for ra in ras[:5]:
            materia_nombre = ra.fk_id_materia_profesores.fk_id_materia.nombre if ra.fk_id_materia_profesores else "Sin materia"
            print(f"  - RA {ra.numero_ra}: {ra.nombre_ra} - {materia_nombre}")
    
    # Verificar actividades
    actividades = Actividades.objects.all()
    print(f"\n📝 Total de actividades: {actividades.count()}")
    if actividades.exists():
        print("Primeras 5 actividades:")
        for act in actividades[:5]:
            ra = act.fk_id_ra
            materia_nombre = ra.fk_id_materia_profesores.fk_id_materia.nombre if ra and ra.fk_id_materia_profesores else "Sin materia"
            print(f"  - {act.nombre} - {materia_nombre}")
    
    # Verificar notas
    notas = EstudianteNotas.objects.all()
    print(f"\n📊 Total de notas: {notas.count()}")
    if notas.exists():
        print("Primeras 5 notas:")
        for nota in notas[:5]:
            estudiante = nota.fk_numero_documento_estudiante.nombre_completo
            actividad = nota.fk_id_actividad.nombre
            print(f"  - {estudiante}: {actividad} = {nota.calificacion}")
    
    # Verificar notas de un estudiante específico
    print("\n" + "=" * 80)
    print("VERIFICACIÓN DETALLADA DE UN ESTUDIANTE")
    print("=" * 80)
    
    if estudiantes.exists():
        estudiante = estudiantes.first()
        print(f"\nEstudiante: {estudiante.nombre_completo} ({estudiante.numero_documento_estudiante})")
        
        notas_estudiante = EstudianteNotas.objects.filter(
            fk_numero_documento_estudiante=estudiante
        ).select_related(
            'fk_id_actividad',
            'fk_id_actividad__fk_id_ra',
            'fk_id_actividad__fk_id_ra__fk_id_materia_profesores',
            'fk_id_actividad__fk_id_ra__fk_id_materia_profesores__fk_id_materia'
        )
        
        print(f"Total de notas: {notas_estudiante.count()}")
        
        if notas_estudiante.exists():
            print("\nNotas por materia:")
            materias_dict = {}
            for nota in notas_estudiante:
                try:
                    ra = nota.fk_id_actividad.fk_id_ra
                    if ra and ra.fk_id_materia_profesores:
                        materia = ra.fk_id_materia_profesores.fk_id_materia
                        materia_nombre = materia.nombre
                        
                        if materia_nombre not in materias_dict:
                            materias_dict[materia_nombre] = []
                        
                        materias_dict[materia_nombre].append({
                            'actividad': nota.fk_id_actividad.nombre,
                            'calificacion': float(nota.calificacion)
                        })
                except Exception as e:
                    print(f"  ⚠️ Error procesando nota: {e}")
            
            for materia, notas_list in materias_dict.items():
                promedio = sum(n['calificacion'] for n in notas_list) / len(notas_list)
                print(f"\n  📚 {materia} (Promedio: {promedio:.2f})")
                for n in notas_list:
                    print(f"    - {n['actividad']}: {n['calificacion']}")
        else:
            print("  ⚠️ Este estudiante no tiene notas registradas")
    
    print("\n" + "=" * 80)

if __name__ == '__main__':
    verificar_datos()
