# Modelo de Usuario personalizado para autenticación
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLES = (
        ('docente', 'Docente'),
        ('secretaria', 'Secretaría Académica'),
        ('coordinacion', 'Coordinación Administrativa'),
        ('padres', 'Padres de familia'),
    )
    rol = models.CharField(max_length=20, choices=ROLES)
    first_name = models.CharField(max_length=150 ,blank=True, null=True)
    last_name = models.CharField(max_length=150 ,blank=True, null=True)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.username} - {self.get_rol_display()}"


# Importar todos los modelos de la base de datos
from .models_db import *





