"""
Script para probar la llamada al API
"""
import os
import django
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_srp.settings')
django.setup()

from django.test import RequestFactory
from core.views import EstudianteNotasViewSet

def test_api():
    print("=" * 80)
    print("PRUEBA DEL API DE NOTAS")
    print("=" * 80)
    
    # Crear una request factory
    factory = RequestFactory()
    
    # Probar con el estudiante 121212
    estudiante_id = "121212"
    print(f"\n🔍 Probando endpoint: /api/notas/?fk_numero_documento_estudiante={estudiante_id}")
    
    # Crear request GET
    request = factory.get(f'/api/notas/?fk_numero_documento_estudiante={estudiante_id}')
    
    # Crear instancia del viewset
    viewset = EstudianteNotasViewSet.as_view({'get': 'list'})
    
    # Ejecutar la vista
    try:
        response = viewset(request)
        response.render()
        
        print(f"\n✅ Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = json.loads(response.content)
            print(f"\n📊 Total de notas retornadas: {len(data)}")
            
            if len(data) > 0:
                print(f"\n📝 Primera nota:")
                primera_nota = data[0]
                print(json.dumps(primera_nota, indent=2, ensure_ascii=False))
                
                print(f"\n📝 Segunda nota:")
                if len(data) > 1:
                    segunda_nota = data[1]
                    print(json.dumps(segunda_nota, indent=2, ensure_ascii=False))
            else:
                print("⚠️ No se retornaron notas")
        else:
            print(f"\n❌ Error: {response.content.decode()}")
    except Exception as e:
        print(f"\n💥 Error ejecutando la vista: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 80)

if __name__ == '__main__':
    test_api()
