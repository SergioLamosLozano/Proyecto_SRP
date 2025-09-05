from django.urls import path, include
from core import views
from rest_framework import routers 
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView


router = routers.DefaultRouter()
router.register(r'administradores', views.administradorView, basename='administrador')

urlpatterns = [
    path('api/v1/', include(router.urls)),
]
    