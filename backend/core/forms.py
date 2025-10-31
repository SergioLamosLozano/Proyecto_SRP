from django import forms
from .models_db import *


class EstudiantesForm(forms.ModelForm):
    class Meta:
        model = Estudiantes
        fields = '__all__'
        widgets = {
            'numero_documento': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Número de documento'}),
            'primer_nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Primer nombre'}),
            'segundo_nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Segundo nombre'}),
            'primer_apellido': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Primer apellido'}),
            'segundo_apellido': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Segundo apellido'}),
            'fecha_nacimiento': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'telefono': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Teléfono'}),
            'direccion': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Dirección'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}),
            'fk_id_tipo_documento': forms.Select(attrs={'class': 'form-control'}),
            'fk_id_genero': forms.Select(attrs={'class': 'form-control'}),
            'fk_codigo_municipio': forms.Select(attrs={'class': 'form-control'}),
            'fk_id_tipo_sangre': forms.Select(attrs={'class': 'form-control'}),
            'fk_tipo_estado': forms.Select(attrs={'class': 'form-control'}),
            'fk_id_sisben': forms.Select(attrs={'class': 'form-control'}),
            'fk_id_discapacidad': forms.Select(attrs={'class': 'form-control'}),
            'fk_id_alergia': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'numero_documento': 'Número de Documento',
            'primer_nombre': 'Primer Nombre',
            'segundo_nombre': 'Segundo Nombre',
            'primer_apellido': 'Primer Apellido',
            'segundo_apellido': 'Segundo Apellido',
            'fecha_nacimiento': 'Fecha de Nacimiento',
            'telefono': 'Teléfono',
            'direccion': 'Dirección',
            'email': 'Email',
            'fk_id_tipo_documento': 'Tipo de Documento',
            'fk_id_genero': 'Género',
            'fk_codigo_municipio': 'Ciudad',
            'fk_id_tipo_sangre': 'Tipo de Sangre',
            'fk_tipo_estado': 'Estado',
            'fk_id_sisben': 'Sisben',
            'fk_id_discapacidad': 'Discapacidad',
            'fk_id_alergia': 'Alergia',
        }


class ProfesoresForm(forms.ModelForm):
    class Meta:
        model = Profesores
        fields = '__all__'
        widgets = {
            'numero_documento': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Número de documento'}),
            'primer_nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Primer nombre'}),
            'segundo_nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Segundo nombre'}),
            'primer_apellido': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Primer apellido'}),
            'segundo_apellido': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Segundo apellido'}),
            'telefono': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Teléfono'}),
            'direccion': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Dirección'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}),
            'fk_id_tipo_documento': forms.Select(attrs={'class': 'form-control'}),
            'fk_codigo_municipio': forms.Select(attrs={'class': 'form-control'}),
            'fk_id_estado': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'numero_documento': 'Número de Documento',
            'primer_nombre': 'Primer Nombre',
            'segundo_nombre': 'Segundo Nombre',
            'primer_apellido': 'Primer Apellido',
            'segundo_apellido': 'Segundo Apellido',
            'telefono': 'Teléfono',
            'direccion': 'Dirección',
            'email': 'Email',
            'fk_id_tipo_documento': 'Tipo de Documento',
            'fk_codigo_municipio': 'Ciudad',
            'fk_id_estado': 'Estado',
        }


class AcudienteForm(forms.ModelForm):
    class Meta:
        model = Acudiente
        fields = '__all__'
        widgets = {
            'numero_documento': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Número de documento'}),
            'primer_nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Primer nombre'}),
            'segundo_nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Segundo nombre'}),
            'primer_apellido': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Primer apellido'}),
            'segundo_apellido': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Segundo apellido'}),
            'telefono': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Teléfono'}),
            'direccion': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Dirección'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}),
            'fk_id_tipo_documento': forms.Select(attrs={'class': 'form-control'}),
            'fk_codigo_municipio': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'numero_documento': 'Número de Documento',
            'primer_nombre': 'Primer Nombre',
            'segundo_nombre': 'Segundo Nombre',
            'primer_apellido': 'Primer Apellido',
            'segundo_apellido': 'Segundo Apellido',
            'telefono': 'Teléfono',
            'direccion': 'Dirección',
            'email': 'Email',
            'fk_id_tipo_documento': 'Tipo de Documento',
            'fk_codigo_municipio': 'Ciudad',
        }


class EstudiantesAcudientesForm(forms.ModelForm):
    class Meta:
        model = EstudiantesAcudientes
        fields = '__all__'
        widgets = {
            'fk_numero_documento_estudiante': forms.Select(attrs={'class': 'form-control'}),
            'fk_numero_documento_acudiente': forms.Select(attrs={'class': 'form-control'}),
            'fk_id_tipo_acudiente': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'fk_numero_documento_estudiante': 'Estudiante',
            'fk_numero_documento_acudiente': 'Acudiente',
            'fk_id_tipo_acudiente': 'Tipo de Acudiente',
        }


# Formularios para modelos de catálogos
class TipoDocumentoForm(forms.ModelForm):
    class Meta:
        model = TipoDocumento
        fields = '__all__'
        widgets = {
            'descripcion': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Descripción'}),
        }


class TipoEstadoForm(forms.ModelForm):
    class Meta:
        model = TipoEstado
        fields = '__all__'
        widgets = {
            'descripcion': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Descripción'}),
        }


class GeneroForm(forms.ModelForm):
    class Meta:
        model = Genero
        fields = '__all__'
        widgets = {
            'descripcion': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Descripción'}),
        }


class DepartamentoForm(forms.ModelForm):
    class Meta:
        model = Departamento
        fields = '__all__'
        widgets = {
            'codigo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Código'}),
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre'}),
        }


class CiudadForm(forms.ModelForm):
    class Meta:
        model = Ciudad
        fields = '__all__'
        widgets = {
            'codigo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Código'}),
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre'}),
            'fk_codigo_departamento': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'codigo': 'Código',
            'nombre': 'Nombre',
            'fk_codigo_departamento': 'Departamento',
        }