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

class PeriodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Periodo
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
        token['id'] = user.id
        return token

class MateriasAsignadasSerializer(serializers.ModelSerializer):
    profesor_nombre = serializers.SerializerMethodField()
    materia_nombre = serializers.CharField(source='fk_id_materia.nombre', read_only=True)
    curso_nombre = serializers.CharField(source='fk_id_curso.nombre', read_only=True)
    año_electivo_valor = serializers.CharField(source='fk_id_año_electivo.id_año_electivo', read_only=True)
    usuario_creacion_nombre = serializers.CharField(source='fk_usuario_creacion.username', read_only=True)

    def get_profesor_nombre(self, obj):
        prof = obj.fk_numero_documento_profesor
        return f"{prof.nombre1 or ''} {prof.nombre2 or ''}".strip()

    class Meta:
        model = MateriasAsignadas
        fields = '__all__'
        read_only_fields = [
            'profesor_nombre',
            'materia_nombre',
            'curso_nombre',
            'año_electivo_valor',
            'usuario_creacion_nombre'
        ]

class ActividadesSerializer(serializers.ModelSerializer):
    MateriaProfesores = MateriasAsignadasSerializer(read_only=True, source='fk_id_materia_profesores')
    Tipo_Actividad = serializers.CharField(read_only=True, source='fk_id_tipo_actividad.descripcion')
    class Meta:
        model = Actividades
        fields = '__all__'
        read_only_fields = [
            'Tipo_Actividad'
        ]


class EstudiantesCursosSerializer(serializers.ModelSerializer):
    nombre_estudiante = serializers.SerializerMethodField()
    curso_nombre = serializers.CharField(source='id_curso.nombre', read_only=True)
    año_electivo = serializers.CharField(source='id_curso.fk_id_año_electivo.id_año_electivo', read_only=True)
    estado_curso = serializers.CharField(source='id_curso.estado', read_only=True)

    class Meta:
        model = Estudiantes_cursos
        fields = '__all__'
        read_only_fields = [
            'nombre_estudiante',
            'curso_nombre',
            'año_electivo',
            'estado_curso'
        ]

    def get_nombre_estudiante(self, obj):
        est = obj.numero_documento_estudiante
        return f"{est.nombre1} {est.nombre2 or ''} {est.apellido1} {est.apellido2 or ''}".strip()

class EstudiantesSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()
    cursos = EstudiantesCursosSerializer(many=True, read_only=True,source='estudiantes_cursos_set')
    tipo_documento = serializers.CharField(source='fk_id_tipo_documento.descripcion', read_only=True)
    genero = serializers.CharField(source='fk_id_genero.descripcion', read_only=True)
    municipio = serializers.CharField(source='fk_codigo_municipio.nombre', read_only=True)
    tipo_sangre = serializers.CharField(source='fk_id_tipo_sangre.descripcion', read_only=True)
    tipo_sisben = serializers.CharField(source='fk_id_tipo_sisben.descripcion', read_only=True)
    tipo_discapacidad = serializers.CharField(source='fk_id_tipo_discapacidad.descripcion', read_only=True)
    tipo_alergia = serializers.CharField(source='fk_id_tipo_alergia.descripcion', read_only=True)
    estado = serializers.CharField(source='fk_tipo_estado.descripcion', read_only=True)
    class Meta:
        model = Estudiantes
        fields = '__all__'
        read_only_fields = [
            'tipo_documento',
            'genero',
            'municipio',
            'tipo_sangre',
            'tipo_sisben',
            'tipo_discapacidad',
            'tipo_alergia',
            'estado',
            ]
    def get_nombre_completo(self, obj):
        return f"{obj.nombre1} {obj.nombre2 or ''} {obj.apellido1} {obj.apellido2 or ''}".strip()

class ProfesoresSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()
    materias = MateriasAsignadasSerializer(many=True, read_only=True,source='materiasasignadas_set')
    tipo_documento_desc = serializers.CharField(source='fk_id_tipo_documento.descripcion', read_only=True)
    ciudad_nombre = serializers.CharField(source='fk_codigo_municipio.nombre', read_only=True)
    estado_desc = serializers.CharField(source='fk_id_estado.descripcion', read_only=True)
    
    class Meta:
        model = Profesores
        fields = '__all__'
    def get_nombre_completo(self, obj):
        return f"{obj.nombre1} {obj.nombre2 or ''} {obj.apellido1} {obj.apellido2 or ''}".strip()
    
class EstudianteNotasSerializer(serializers.ModelSerializer):
    estudiante = EstudiantesSerializer(read_only=True, source='fk_numero_documento_estudiante')
    actividad = ActividadesSerializer(read_only=True, source='fk_id_actividad')

    class Meta:
        model = EstudianteNotas
        fields = '__all__'
