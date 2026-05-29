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
    # Nombre derivado: si no hay 'nombre' explícito devolvemos uno legible
    nombre_display = serializers.SerializerMethodField()
    año_electivo = serializers.IntegerField(
        source='fk_id_año_electivo.id_año_electivo', read_only=True
    )

    class Meta:
        model = Periodo
        fields = '__all__'

    def get_nombre_display(self, obj):
        return obj.nombre or f"Periodo {obj.id_periodo}"

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

    profe_nombre = serializers.SerializerMethodField()
    materia = serializers.CharField(source='fk_id_materia.nombre', read_only=True)
    curso = serializers.CharField(source='fk_id_curso.nombre', read_only=True)

    class Meta:
        model = MateriasAsignadas
        fields = '__all__'
    
    def get_profe_nombre(self, obj):
        profesor = obj.fk_numero_documento_profesor

        nombre_completo = f'{profesor.nombre1} {profesor.nombre2} {profesor.apellido1} {profesor.apellido2}'

        return nombre_completo.strip()
    

class ActividadesSerializer(serializers.ModelSerializer):
    Tipo_Actividad = serializers.CharField(read_only=True, source='fk_id_tipo_actividad.descripcion')
    curso = serializers.CharField(read_only=True, source='fk_id_ra.fk_id_materia_profesores.fk_id_curso.nombre')
    materia = serializers.CharField(read_only=True, source='fk_id_ra.fk_id_materia_profesores.fk_id_materia.nombre')
    id_curso = serializers.CharField(read_only=True, source='fk_id_ra.fk_id_materia_profesores.fk_id_curso')

    def validate_porcentaje(self, value):
        if value < 1 or value > 100:
            raise serializers.ValidationError("el porcentaje debe estar entre 1 y 100")
        return value

    class Meta:
        model = Actividades
        fields = '__all__'
        read_only_fields = [
            'Tipo_Actividad',
            'curso',
            'materia',
            'id_curso'
        ]



class EstudiantesCursosSerializer(serializers.ModelSerializer):
    estudiante = serializers.SerializerMethodField()
    nombre_curso = serializers.CharField(read_only=True, source="id_curso.nombre")

    class Meta:
        model = Estudiantes_cursos
        fields = '__all__'
        read_only_fields = [
            "nombre_curso"
        ]
    
    def get_estudiante(self, obj):
        est = obj.numero_documento_estudiante

        estudiante = {
            "numero_documento": est.numero_documento_estudiante,
            "nombre": f"{est.nombre1} {est.nombre2 or ""} {est.apellido1} {est.apellido2 or ""}",
            "correo": est.correo,
            "telefono": est.telefono,
            "estado": est.fk_tipo_estado.descripcion
        }

        return estudiante

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
    
class ActividadDetalleSerializer(serializers.ModelSerializer):
    """Serializer para actividades con información completa"""
    MateriaProfesores = serializers.SerializerMethodField()
    fk_id_periodo_academico = serializers.SerializerMethodField()
    
    def get_MateriaProfesores(self, obj):
        try:
            if obj.fk_id_ra and obj.fk_id_ra.fk_id_materia_profesores:
                mp = obj.fk_id_ra.fk_id_materia_profesores
                return {
                    'id_materia_profesores': mp.id_materia_profesores,
                    'materia_nombre': mp.fk_id_materia.nombre if mp.fk_id_materia else None,
                    'curso_nombre': mp.fk_id_curso.nombre if mp.fk_id_curso else None,
                }
        except Exception:
            pass
        return None
    
    def get_fk_id_periodo_academico(self, obj):
        try:
            if obj.fk_id_ra and obj.fk_id_ra.fk_id_periodo_academico:
                return obj.fk_id_ra.fk_id_periodo_academico.id_periodo
        except Exception:
            pass
        return None
    
    class Meta:
        model = Actividades
        fields = ['id_actividades', 'nombre', 'descripcion', 'porcentaje', 
                  'fecha_inicio', 'fecha_fin', 'MateriaProfesores', 'fk_id_periodo_academico']


class EstudianteNotasSerializer(serializers.ModelSerializer):
    # Campos adicionales para compatibilidad con frontend web
    nombre_actividad = serializers.SerializerMethodField()
    descripcion_actividad = serializers.SerializerMethodField()
    periodo = serializers.SerializerMethodField()
    nombre_materia = serializers.SerializerMethodField()
    id_materia = serializers.SerializerMethodField()
    nombre_grado = serializers.SerializerMethodField()
    nombre_completo_estudiante = serializers.CharField(read_only=True, source="fk_numero_documento_estudiante.nombre_completo")
    porcentaje_ra = serializers.SerializerMethodField()
    porcentaje_actividad = serializers.SerializerMethodField()
    
    # Actividad completa anidada para el frontend web
    actividad = ActividadDetalleSerializer(source='fk_id_actividad', read_only=True)

    def get_nombre_actividad(self, obj):
        return obj.fk_id_actividad.nombre if obj.fk_id_actividad else None
    
    def get_descripcion_actividad(self, obj):
        return obj.fk_id_actividad.descripcion if obj.fk_id_actividad else None
    
    def get_periodo(self, obj):
        try:
            if obj.fk_id_actividad and obj.fk_id_actividad.fk_id_ra and obj.fk_id_actividad.fk_id_ra.fk_id_periodo_academico:
                return obj.fk_id_actividad.fk_id_ra.fk_id_periodo_academico.id_periodo
        except Exception:
            pass
        return None
    
    def get_nombre_materia(self, obj):
        try:
            if (obj.fk_id_actividad and 
                obj.fk_id_actividad.fk_id_ra and 
                obj.fk_id_actividad.fk_id_ra.fk_id_materia_profesores and
                obj.fk_id_actividad.fk_id_ra.fk_id_materia_profesores.fk_id_materia):
                return obj.fk_id_actividad.fk_id_ra.fk_id_materia_profesores.fk_id_materia.nombre
        except Exception:
            pass
        return None
    
    def get_id_materia(self, obj):
        try:
            if (obj.fk_id_actividad and 
                obj.fk_id_actividad.fk_id_ra and 
                obj.fk_id_actividad.fk_id_ra.fk_id_materia_profesores and
                obj.fk_id_actividad.fk_id_ra.fk_id_materia_profesores.fk_id_materia):
                return obj.fk_id_actividad.fk_id_ra.fk_id_materia_profesores.fk_id_materia.id_materia
        except Exception:
            pass
        return None
    
    def get_nombre_grado(self, obj):
        try:
            if (obj.fk_id_actividad and 
                obj.fk_id_actividad.fk_id_ra and 
                obj.fk_id_actividad.fk_id_ra.fk_id_materia_profesores and
                obj.fk_id_actividad.fk_id_ra.fk_id_materia_profesores.fk_id_curso):
                return obj.fk_id_actividad.fk_id_ra.fk_id_materia_profesores.fk_id_curso.nombre
        except Exception:
            pass
        return None
    
    def get_porcentaje_ra(self, obj):
        try:
            if obj.fk_id_actividad and obj.fk_id_actividad.fk_id_ra:
                return obj.fk_id_actividad.fk_id_ra.porcentaje
        except Exception:
            pass
        return None
    
    def get_porcentaje_actividad(self, obj):
        return obj.fk_id_actividad.porcentaje if obj.fk_id_actividad else None

    def validate_calificacion(self, value):
        # Bug fix: antes usaba "return" en vez de "raise", la validación nunca se aplicaba.
        if value is None:
            raise serializers.ValidationError("La calificación es requerida")
        try:
            v = float(value)
        except (TypeError, ValueError):
            raise serializers.ValidationError("La calificación debe ser numérica")
        if v < 0 or v > 5.0:
            raise serializers.ValidationError("La calificación debe estar entre 0 y 5")
        return value

    class Meta:
        model = EstudianteNotas
        fields = '__all__'
        read_only_fields = [
            'nombre_completo_estudiante',
        ]

class RASerializer(serializers.ModelSerializer):
    materia = serializers.CharField(read_only=True, source="fk_id_materia_profesores.fk_id_materia.nombre")
    curso = serializers.CharField(read_only=True, source="fk_id_materia_profesores.fk_id_curso.nombre")
    class Meta:
        model = RA
        fields = '__all__'
        read_only_fileds = [
            "materia"
        ]

class NotaHistorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotaHistorial
        fields = '__all__'

class DefinitivaSerializer(serializers.ModelSerializer):
    nombre_estudiante = serializers.CharField(read_only=True, source="fk_id_estudiantes_cursos.numero_documento_estudiante.nombre_completo")
    nombre_materia = serializers.CharField(read_only=True, source="fk_id_materia.nombre")

    class Meta:
        model = Definitivas
        fields = "__all__"
        read_only_fields = [
            'nombre_estudiante',
            'nombre_materia'
        ]


class ConfiguracionBoletinesSerializer(serializers.ModelSerializer):
    """
    Serializer para la configuración de descarga de boletines
    """
    usuario_modificacion_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = ConfiguracionBoletines
        fields = '__all__'
        read_only_fields = ['fecha_modificacion']
    
    def get_usuario_modificacion_nombre(self, obj):
        if obj.fk_usuario_modificacion:
            return f"{obj.fk_usuario_modificacion.first_name} {obj.fk_usuario_modificacion.last_name}".strip() or obj.fk_usuario_modificacion.username
        return None
