"""
Vistas para la configuración de boletines
Permite habilitar/deshabilitar la descarga de boletines para padres/acudientes
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models_db import ConfiguracionBoletines
from .serializer import ConfiguracionBoletinesSerializer


class ConfiguracionBoletinesViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar la configuración de descarga de boletines.
    
    Endpoints:
    - GET /api/configuracion/boletines/ - Obtener configuración actual
    - PUT /api/configuracion/boletines/1/ - Actualizar configuración (solo coordinador)
    - GET /api/configuracion/boletines/estado/ - Obtener solo el estado (público)
    """
    queryset = ConfiguracionBoletines.objects.all()
    serializer_class = ConfiguracionBoletinesSerializer
    permission_classes = [IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        """
        Obtiene o crea la configuración única de boletines
        """
        config = ConfiguracionBoletines.get_configuracion()
        serializer = self.get_serializer(config)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        """
        Actualiza la configuración de boletines.
        Solo usuarios con rol 'coordinacion' pueden actualizar.
        """
        # Verificar que el usuario tenga rol de coordinación
        if not hasattr(request.user, 'rol') or request.user.rol != 'coordinacion':
            return Response(
                {'error': 'Solo el coordinador puede modificar esta configuración'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        config = ConfiguracionBoletines.get_configuracion()
        
        # Actualizar el usuario que modificó
        data = request.data.copy()
        data['fk_usuario_modificacion'] = request.user.id
        
        serializer = self.get_serializer(config, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[])
    def estado(self, request):
        """
        Endpoint público para consultar solo el estado de habilitación.
        No requiere autenticación.
        Uso: GET /api/configuracion/boletines/estado/
        """
        config = ConfiguracionBoletines.get_configuracion()
        return Response({
            'descarga_habilitada': config.descarga_habilitada,
            'fecha_modificacion': config.fecha_modificacion
        })
