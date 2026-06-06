"""
Script para probar el endpoint de notas
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_srp.settings')
django.setup()

from core.models_db import Estudiantes, EstudianteNotas
from core.serializer import EstudianteNotasSerializer

def test_endpoint():
    print("=" * 80)
    print("PRUEBA DEL ENDPOINT DE NOTAS")
    print("=" * 80)
    
    # Probar con el estudiante 121212 (David)
    estudiante_id = "121212"
    print(f"\nBuscando notas del estudiante: {estudiante_id}")
    
    # Verificar si el estudiante existe
    try:
        estudiante = Estudiantes.objects.get(numero_documento_estudiante=estudiante_id)
        print(f"✅ Estudiante encontrado: {estudiante.nombre_completo}")
    except Estudiantes.DoesNotExist:
        print(f"❌ Estudiante {estudiante_id} no existe")
        return
    
    # Buscar notas
    notas = EstudianteNotas.objects.filter(
        fk_numero_documento_estudiante=estudiante_id
    )
    
    print(f"\n📊 Total de notas encontradas: {notas.count()}")
    
    if notas.exists():
        # Serializar las notas
        serializer = EstudianteNotasSerializer(notas, many=True)
        data = serializer.data
        
        print(f"\n📝 Datos serializados ({len(data)} notas):")
        for i, nota in enumerate(data[:5], 1):  # Mostrar solo las primeras 5
            print(f"\nNota {i}:")
            print(f"  - ID: {nota.get('id_estudiante_notas')}")
            print(f"  - Actividad: {nota.get('nombre_actividad')}")
            print(f"  - Calificación: {nota.get('calificacion')}")
            print(f"  - Materia: {nota.get('nombre_materia')}")
            print(f"  - ID Materia: {nota.get('id_materia')}")
            print(f"  - Periodo: {nota.get('periodo')}")
            print(f"  - Porcentaje Actividad: {nota.get('porcentaje_actividad')}")
        
        if len(data) > 5:
            print(f"\n... y {len(data) - 5} notas más")
    else:
        print("⚠️ No se encontraron notas para este estudiante")
    
    # Probar con otro estudiante que sabemos que tiene notas
    print("\n" + "=" * 80)
    estudiante_id = "1001"
    print(f"\nBuscando notas del estudiante: {estudiante_id}")
    
    try:
        estudiante = Estudiantes.objects.get(numero_documento_estudiante=estudiante_id)
        print(f"✅ Estudiante encontrado: {estudiante.nombre_completo}")
    except Estudiantes.DoesNotExist:
        print(f"❌ Estudiante {estudiante_id} no existe")
        return
    
    notas = EstudianteNotas.objects.filter(
        fk_numero_documento_estudiante=estudiante_id
    )
    
    print(f"\n📊 Total de notas encontradas: {notas.count()}")
    
    if notas.exists():
        serializer = EstudianteNotasSerializer(notas, many=True)
        data = serializer.data
        
        print(f"\n📝 Datos serializados ({len(data)} notas):")
        for i, nota in enumerate(data[:3], 1):
            print(f"\nNota {i}:")
            print(f"  - Actividad: {nota.get('nombre_actividad')}")
            print(f"  - Calificación: {nota.get('calificacion')}")
            print(f"  - Materia: {nota.get('nombre_materia')}")
            print(f"  - ID Materia: {nota.get('id_materia')}")
    
    print("\n" + "=" * 80)

if __name__ == '__main__':
    test_endpoint()
