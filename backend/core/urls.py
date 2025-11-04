from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TipoDocumentoViewSet, CustomTokenObtainPairView,TipoSangreViewSet, GeneroViewSet, EstadoViewSet,
    DepartamentoViewSet, CiudadViewSet,
    EstudianteViewSet, ProfesorViewSet, AcudienteViewSet, EstudianteAcudienteViewSet,
    EstudiantesBulkUploadView
)


router = DefaultRouter()
router.register(r'tipo-documento', TipoDocumentoViewSet, basename='Documentos')
router.register(r'tipo-sangre', TipoSangreViewSet, basename='Tipos_sangre')
router.register(r'genero', GeneroViewSet, basename='Generos')
router.register(r'estado', EstadoViewSet, basename='Estados')
router.register(r'departamento', DepartamentoViewSet, basename='Departamentos')
router.register(r'ciudad', CiudadViewSet, basename='Ciudad')
router.register(r'estudiantes', EstudianteViewSet, basename='Estudiantes')
router.register(r'profesores', ProfesorViewSet, basename='Profesores')
router.register(r'acudientes', AcudienteViewSet, basename='Acudientes')
router.register(r'estudiantes-acudientes', EstudianteAcudienteViewSet, basename='Estudiante_Acudiente')

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/estudiantes/carga-masiva/', EstudiantesBulkUploadView.as_view(), name='carga_masiva_estudiantes'),
]

urlpatterns += router.urls