# Modelo de Usuario personalizado para autenticación
from django.contrib.auth.models import AbstractUser
from django.db import models


#se agrego a los users un apartado foto que permite subir una foto para mostrarla en el navbar, para crearlo es estos comandos
#python manage.py shell
#from core.models import User
#from django.core.files import File
#>>> f = open("C:/Users/juanm/Downloads/usuario.png", "rb")
#>>> user = User.objects.create_user(
#... username="lopez",
#... password="1234",
#... is_active=1,    
#... rol="secretaria"
#... )
#>>> user.foto.save("usuario.png", File(f)) (en usuario.png es el nombre que va a tener la imagen)
#>>> user.save()
#>>> f.close()
#>>> exit()

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







