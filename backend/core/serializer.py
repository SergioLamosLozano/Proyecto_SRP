from rest_framework import serializers
from .models import User
from .models_db import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# Serializers para modelos de catálogos/tipos
class TipoDocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDocumento
        fields = '__all__'

class TipoActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoActividad
        fields = '__all__'

class ActividadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividades
        fields = '__all__'

class TipoEstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEstado
        fields = '__all__'


class TipoSangreSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoSangre
        fields = '__all__'


class GeneroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genero
        fields = '__all__'


class SisbenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sisben
        fields = '__all__'

class AnoElectivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ano_electivo
        fields = '__all__'

class AreaConocimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area_conocimiento
        fields = '__all__'

class CursoSerializer(serializers.ModelSerializer):
    fecha_inicio = serializers.DateField(source='fk_id_año_electivo.fecha_inicio', read_only=True)
    fecha_fin = serializers.DateField(source='fk_id_año_electivo.fecha_fin', read_only=True)
    class Meta:
        model = Cursos
        fields = '__all__'

class MatriaSerializer(serializers.ModelSerializer):
    nombre_area_conocimiento = serializers.CharField(source='fk_Id_area_conocimiento.nombre', read_only=True)
    class Meta:
        model = Materias
        fields = '__all__'

class DiscapacidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discapacidad
        fields = '__all__'


class AlergiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alergia
        fields = '__all__'


class TipoAcudienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAcudiente
        fields = '__all__'


# Serializers para modelos geográficos
class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = '__all__'


class CiudadSerializer(serializers.ModelSerializer):
    # Removemos departamento_nombre temporalmente para evitar el error
    class Meta:
        model = Ciudad
        fields = '__all__'


class ProcedenciaSerializer(serializers.ModelSerializer):
    ciudad_nombre = serializers.CharField(source='fk_codigo_municipio.nombre', read_only=True)
    
    class Meta:
        model = Procedencia
        fields = '__all__'


# Serializers para modelos principales
class EstudiantesSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()
    numero_documento = serializers.ReadOnlyField()
    primer_nombre = serializers.ReadOnlyField()
    segundo_nombre = serializers.ReadOnlyField()
    primer_apellido = serializers.ReadOnlyField()
    segundo_apellido = serializers.ReadOnlyField()
    tipo_documento_desc = serializers.CharField(source='fk_id_tipo_documento.descripcion', read_only=True)
    genero_desc = serializers.CharField(source='fk_id_genero.descripcion', read_only=True)
    ciudad_nombre = serializers.CharField(source='fk_codigo_municipio.nombre', read_only=True)
    tipo_sangre_desc = serializers.CharField(source='fk_id_tipo_sangre.descripcion', read_only=True)
    estado_desc = serializers.CharField(source='fk_tipo_estado.descripcion', read_only=True)
    
    class Meta:
        model = Estudiantes
        fields = [
            'numero_documento_estudiante', 'numero_documento', 'nombre1', 'primer_nombre',
            'nombre2', 'segundo_nombre', 'apellido1', 'primer_apellido', 'apellido2', 'segundo_apellido',
            'correo', 'direccion', 'edad', 'fecha_nacimiento', 'telefono', 'religion',
            'nombre_completo', 'tipo_documento_desc', 'genero_desc', 'ciudad_nombre', 
            'tipo_sangre_desc', 'estado_desc',
            'fk_id_tipo_documento', 'fk_id_genero', 'fk_codigo_municipio', 
            'fk_id_tipo_sangre', 'fk_id_tipo_sisben', 'fk_tipo_estado'
        ]


class ProfesoresSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()
    tipo_documento_desc = serializers.CharField(source='fk_id_tipo_documento.descripcion', read_only=True)
    ciudad_nombre = serializers.CharField(source='fk_codigo_municipio.nombre', read_only=True)
    estado_desc = serializers.CharField(source='fk_id_estado.descripcion', read_only=True)
    
    class Meta:
        model = Profesores
        fields = '__all__'


class AcudienteSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()
    tipo_documento_desc = serializers.CharField(source='fk_id_tipo_documento.descripcion', read_only=True)
    ciudad_nombre = serializers.CharField(source='fk_codigo_municipio.nombre', read_only=True)
    
    class Meta:
        model = Acudiente
        fields = '__all__'


class EstudiantesAcudientesSerializer(serializers.ModelSerializer):
    estudiante_nombre = serializers.CharField(source='fk_numero_documento_estudiante.nombre_completo', read_only=True)
    acudiente_nombre = serializers.CharField(source='fk_numero_documento_acudiente.nombre_completo', read_only=True)
    tipo_acudiente_desc = serializers.CharField(source='fk_id_tipo_acudiente.descripcion', read_only=True)
    
    class Meta:
        model = EstudiantesAcudientes
        fields = '__all__'


# Serializers existentes
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Permitimos que el registro reciba nombre, apellidos y email además de username/password/rol
        fields = ['username', 'password', 'rol', 'first_name', 'last_name', 'email']
        extra_kwargs = {'password': {'write_only': True}, 'email': {'required': False}, 'first_name': {'required': False}, 'last_name': {'required': False}}

    def create(self, validated_data):
        # Extraer campos opcionales
        first_name = validated_data.get('first_name', '')
        last_name = validated_data.get('last_name', '')
        email = validated_data.get('email', '')

        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            rol=validated_data.get('rol'),
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
        return user
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['rol'] = user.rol
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token

class MateriasAsignadasSerializer(serializers.ModelSerializer):
    fk_numero_documento_profesor = serializers.SerializerMethodField()
    def get_fk_numero_documento_profesor(self, obj):
        prof = obj.fk_numero_documento_profesor
        return f"{prof.nombre1 or ''} {prof.nombre2 or ''}".strip()
    fk_id_materia = serializers.CharField(source='fk_id_materia.nombre', read_only=True)
    fk_id_curso = serializers.CharField(source='fk_id_curso.nombre', read_only=True)
    fk_id_año_electivo = serializers.CharField(source='fk_id_año_electivo.id_año_electivo', read_only=True)
    fk_usuario_creacion = serializers.CharField(source='fk_usuario_creacion.username', read_only=True)
    fk_usuario_asignado = serializers.CharField(source='fk_usuario_asignado.username', read_only=True)

    class Meta:
        model = MateriasAsignadas
        fields = '__all__'