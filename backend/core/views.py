from rest_framework import viewsets 
from .models import administrador
from .serializer import AdministradorSerializer


# Create your views here.

class administradorView(viewsets.ModelViewSet):
    queryset = administrador.objects.all()
    serializer_class = AdministradorSerializer
