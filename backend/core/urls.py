from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView


router = DefaultRouter()
router.register(r'tipo-documento', TipoDocumentoViewSet, basename='Documentos')
router.register(r'tipo-sangre', TipoSangreViewSet, basename='Tipos_sangre')
router.register(r'alergia', AlergiaViewSet, basename='Alergia')
router.register(r'sisben', SisbenViewSet, basename='Sisben')
router.register(r'discapacidad', DiscapacidadViewSet, basename='Discapacidad')
router.register(r'genero', GeneroViewSet, basename='Generos')
router.register(r"ano_electivo", anoElectivoViewSet, basename = 'Ano_Electivo')
router.register(r'actividades', ActividadesViewSet, basename='Actividades')
router.register(r'tipo_actividades', TipoActividadViewSet, basename='Tipo_Actividades')
router.register(r'estado', EstadoViewSet, basename='Estados')
router.register(r'materias', MateriasViewSet, basename='Materias')
router.register(r'area_conocimiento', AreaConocimientoViewSet, basename='Area_Conocimiento')
router.register(r'cursos', CursoViewSet, basename='Curso')
router.register(r'departamento', DepartamentoViewSet, basename='Departamentos')
router.register(r'ciudad', CiudadViewSet, basename='Ciudad')
router.register(r'periodo', PeriodoViewSet, basename='Periodo')
router.register(r'estudiantes', EstudianteViewSet, basename='Estudiantes')
router.register(r'profesores', ProfesorViewSet, basename='Profesores')
router.register(r'acudientes', AcudienteViewSet, basename='Acudientes')
router.register(r'notas', EstudianteNotasViewSet, basename='Notas')
router.register(r'match-acudientes', AcudienteUserMatchViewSet, basename='match-acudientes')
router.register(r'estudiantes-acudientes', EstudianteAcudienteViewSet, basename='Estudiante_Acudiente')
router.register(r'materias_asignadas', MateriasAsignadasViewSet, basename='Materias_Asignadas')
router.register(r'estudiantes_cursos', EstudiantesCursosViewSet, basename='Estudiantes_Cursos')

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("super-secreta-9834-hj3/register/", RegisterView.as_view(), name="register"),
    # Plantillas y carga masiva (sin prefijo 'api/' porque ya incluimos en backend_srp/urls.py)
    path('estudiantes/template/', EstudiantesTemplateView.as_view(), name='plantilla_estudiantes'),
    path('profesores/template/', ProfesoresTemplateView.as_view(), name='plantilla_profesores'),
    path('estudiantes/bulk-upload/', EstudiantesBulkUploadView.as_view(), name='bulk_estudiantes'),
    path('profesores/bulk-upload/', ProfesoresBulkUploadView.as_view(), name='bulk_profesores'),
]

urlpatterns += router.urls
