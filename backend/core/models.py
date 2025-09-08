from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    ROLES = (
        ('docente', 'Docente'),
        ('secretaria', 'Secretaría Académica'),
        ('coordinacion', 'Coordinación Administrativa'),
        ('padres', 'Padres de familia'),
    )
    rol = models.CharField(max_length=20, choices=ROLES)





