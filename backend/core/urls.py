from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

# Configurar el router para las APIs REST
router = DefaultRouter()

# Registrar ViewSets para modelos de catálogos/tipos
router.register(r'tipo-documento', TipoDocumentoViewSet)
router.register(r'tipo-estado', TipoEstadoViewSet)
router.register(r'tipo-sangre', TipoSangreViewSet)
router.register(r'genero', GeneroViewSet)
router.register(r'sisben', SisbenViewSet)
router.register(r'discapacidad', DiscapacidadViewSet)
router.register(r'alergia', AlergiaViewSet)
router.register(r'tipo-acudiente', TipoAcudienteViewSet)

# Registrar ViewSets para modelos geográficos
router.register(r'departamento', DepartamentoViewSet)
router.register(r'ciudad', CiudadViewSet)
router.register(r'procedencia', ProcedenciaViewSet)

# Registrar ViewSets para modelos principales
router.register(r'estudiantes', EstudiantesViewSet)
router.register(r'profesores', ProfesoresViewSet)
router.register(r'acudiente', AcudienteViewSet)
router.register(r'estudiantes-acudientes', EstudiantesAcudientesViewSet)

urlpatterns = [
    # APIs REST
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    # Plantillas y carga masiva
    path('estudiantes/template/', EstudiantesTemplateView.as_view(), name='estudiantes_template'),
    path('estudiantes/bulk-upload/', EstudiantesBulkUploadView.as_view(), name='estudiantes_bulk_upload'),
    path('profesores/template/', ProfesoresTemplateView.as_view(), name='profesores_template'),
    path('profesores/bulk-upload/', ProfesoresBulkUploadView.as_view(), name='profesores_bulk_upload'),
    # Exponer las rutas del router directamente para que queden bajo /api/ a nivel de proyecto
    path('', include(router.urls)),
    
    # Vistas HTML
    path('', dashboard, name='dashboard'),
    path('estudiantes/', EstudiantesListView.as_view(), name='estudiantes_list'),
    path('estudiantes/crear/', EstudiantesCreateView.as_view(), name='estudiantes_create'),
    path('estudiantes/<int:numero_documento>/', EstudiantesDetailView.as_view(), name='estudiantes_detail'),
    path('estudiantes/<int:numero_documento>/editar/', EstudiantesUpdateView.as_view(), name='estudiantes_update'),
    path('estudiantes/<int:numero_documento>/eliminar/', EstudiantesDeleteView.as_view(), name='estudiantes_delete'),
    
    # URLs temporales para profesores (placeholder)
    path('profesores/', dashboard, name='profesores_list'),
    path('profesores/crear/', dashboard, name='profesores_create'),
    
    # URLs temporales para acudientes (placeholder)
    path('acudientes/', dashboard, name='acudientes_list'),
    path('acudientes/crear/', dashboard, name='acudientes_create'),
]

    