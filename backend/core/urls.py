from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView
#from .views import LoginView

from .views import CustomTokenObtainPairView


router = DefaultRouter()


urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    #path('token/refresh/', TokenRefreshView.as_view(), name ='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    #path('importarExcel/', ImportarExcelView.as_view(), name='importar_excel'),
    #path('exportarPDF/', ExportarPDFView.asistencia_entrada, name='exportarPDF'),
    #path('exportarExcel/', ExportarExcelView.as_view(), name='exportarExcel'),
]
urlpatterns += router.urls

    