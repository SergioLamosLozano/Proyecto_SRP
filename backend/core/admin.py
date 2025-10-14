from django.contrib import admin
from .models import User
from .models_db import *
from django.contrib.auth.admin import UserAdmin


# Configuración personalizada para el admin
class EstudiantesAdmin(admin.ModelAdmin):
    list_display = ('numero_documento_estudiante', 'nombre_completo', 'correo', 'edad', 'fk_tipo_estado')
    list_filter = ('fk_id_genero', 'fk_tipo_estado', 'fk_id_tipo_documento')
    search_fields = ('numero_documento_estudiante', 'nombre1', 'apellido1', 'correo')
    list_per_page = 20
    ordering = ('apellido1', 'nombre1')


class ProfesoresAdmin(admin.ModelAdmin):
    list_display = ('numero_documento_profesor', 'nombre_completo', 'correo', 'fk_id_estado')
    list_filter = ('fk_id_estado', 'fk_id_tipo_documento')
    search_fields = ('numero_documento_profesor', 'nombre1', 'apellido1', 'correo')
    list_per_page = 20
    ordering = ('apellido1', 'nombre1')


class AcudienteAdmin(admin.ModelAdmin):
    list_display = ('numero_documento_acudiente', 'nombre_completo', 'telefono1', 'fk_codigo_municipio')
    list_filter = ('fk_id_tipo_documento', 'fk_codigo_municipio')
    search_fields = ('numero_documento_acudiente', 'nombre1', 'apellido1')
    list_per_page = 20
    ordering = ('apellido1', 'nombre1')


class EstudiantesAcudientesAdmin(admin.ModelAdmin):
    list_display = ('fk_numero_documento_estudiante', 'fk_numero_documento_acudiente', 'fk_id_tipo_acudiente')
    list_filter = ('fk_id_tipo_acudiente',)
    search_fields = ('fk_numero_documento_estudiante__nombre1', 'fk_numero_documento_acudiente__nombre1')


class CiudadAdmin(admin.ModelAdmin):
    list_display = ('codigo_municipio', 'nombre', 'fk_codigo_departamento')
    list_filter = ('fk_codigo_departamento',)
    search_fields = ('nombre', 'fk_codigo_departamento__nombre')
    ordering = ('fk_codigo_departamento', 'nombre')


# Registro de modelos principales
admin.site.register(User, UserAdmin)

# Modelos de catálogos/tipos
admin.site.register(TipoDocumento)
admin.site.register(TipoEstado)
admin.site.register(TipoSangre)
admin.site.register(Genero)
admin.site.register(Sisben)
admin.site.register(Discapacidad)
admin.site.register(Alergia)
admin.site.register(TipoAcudiente)

# Modelos geográficos
admin.site.register(Departamento)
admin.site.register(Ciudad, CiudadAdmin)
admin.site.register(Procedencia)

# Modelos principales con configuración personalizada
admin.site.register(Estudiantes, EstudiantesAdmin)
admin.site.register(Profesores, ProfesoresAdmin)
admin.site.register(Acudiente, AcudienteAdmin)
admin.site.register(EstudiantesAcudientes, EstudiantesAcudientesAdmin)

