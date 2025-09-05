from django.db import models

# Create your models here.

class administrador(models.Model):
    id = models.AutoField(primary_key=True)
    identificacion = models.CharField(max_length=20, unique=True)
    nombres = models.CharField(max_length=50)
    apellidos = models.CharField(max_length=50)
    correo = models.EmailField(unique=True)
    celular = models.CharField(max_length=15)
    contrasena = models.CharField(max_length=50)
    foto = models.ImageField(upload_to='fotos_administradores/', null=True, blank=True)

    def __str__(self):
        return f"{self.nombres} {self.apellidos} ({self.identificacion})"
