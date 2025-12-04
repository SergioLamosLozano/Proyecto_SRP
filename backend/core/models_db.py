# Modelos generados automáticamente desde la base de datos MySQL
# Estos modelos han sido ajustados para funcionar correctamente con Django

from django.db import models
from core.models import User


# Modelos de catálogos/tipos
class TipoDocumento(models.Model):
    id_tipo_documento = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        db_table = 'tipo_documento'
        verbose_name = 'Tipo de Documento'
        verbose_name_plural = 'Tipos de Documento'

    def __str__(self):
        return self.descripcion


class TipoEstado(models.Model):
    id_tipo_estado = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        db_table = 'tipo_estado'
        verbose_name = 'Tipo de Estado'
        verbose_name_plural = 'Tipos de Estado'

    def __str__(self):
        return self.descripcion


class TipoSangre(models.Model):
    id_tipo_sangre = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        db_table = 'tipo_sangre'
        verbose_name = 'Tipo de Sangre'
        verbose_name_plural = 'Tipos de Sangre'

    def __str__(self):
        return self.descripcion


class Genero(models.Model):
    id_genero = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        db_table = 'genero'
        verbose_name = 'Género'
        verbose_name_plural = 'Géneros'

    def __str__(self):
        return self.descripcion


class Sisben(models.Model):
    id_tipo_sisben = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        db_table = 'sisben'
        verbose_name = 'Tipo Sisben'
        verbose_name_plural = 'Tipos Sisben'

    def __str__(self):
        return self.descripcion


class Discapacidad(models.Model):
    id_tipo_discapacidad = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'discapacidad'
        verbose_name = 'Tipo de Discapacidad'
        verbose_name_plural = 'Tipos de Discapacidad'

    def __str__(self):
        return self.descripcion or f"Discapacidad {self.id_tipo_discapacidad}"


class Alergia(models.Model):
    id_tipo_alergia = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'alergia'
        verbose_name = 'Tipo de Alergia'
        verbose_name_plural = 'Tipos de Alergia'

    def __str__(self):
        return self.descripcion or f"Alergia {self.id_tipo_alergia}"


class TipoAcudiente(models.Model):
    id_tipo_acudiente = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        db_table = 'tipo_acudiente'
        verbose_name = 'Tipo de Acudiente'
        verbose_name_plural = 'Tipos de Acudiente'

    def __str__(self):
        return self.descripcion


# Modelos geográficos
class Departamento(models.Model):
    codigo_departamento = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'departamento'
        verbose_name = 'Departamento'
        verbose_name_plural = 'Departamentos'

    def __str__(self):
        return self.nombre


class Ciudad(models.Model):
    codigo_municipio = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=100)
    fk_codigo_departamento = models.ForeignKey(
        Departamento, 
        on_delete=models.CASCADE, 
        db_column='FK_Departamento'
    )

    class Meta:
        db_table = 'ciudad'
        verbose_name = 'Ciudad'
        verbose_name_plural = 'Ciudades'

    def __str__(self):
        return f"{self.nombre}, {self.fk_codigo_departamento.nombre}"


class Procedencia(models.Model):
    id_procedencia = models.IntegerField(primary_key=True)
    institucion_procedencia = models.CharField(max_length=255, blank=True, null=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    fk_codigo_municipio = models.ForeignKey(
        Ciudad, 
        on_delete=models.SET_NULL, 
        db_column='FK_codigo_municipio', 
        blank=True, 
        null=True
    )

    class Meta:
        db_table = 'procedencia'
        verbose_name = 'Procedencia'
        verbose_name_plural = 'Procedencias'

    def __str__(self):
        return self.institucion_procedencia or f"Procedencia {self.id_procedencia}"


# Modelos principales
class Estudiantes(models.Model):
    numero_documento_estudiante = models.CharField(primary_key=True, max_length=20)
    nombre1 = models.CharField(max_length=50)
    nombre2 = models.CharField(max_length=50, blank=True, null=True)
    apellido1 = models.CharField(max_length=50)
    apellido2 = models.CharField(max_length=50, blank=True, null=True)
    correo = models.EmailField(unique=True, max_length=100, blank=True, null=True)
    institucion_procedencia = models.CharField(max_length=150, blank=True, null=True)
    fk_id_tipo_documento = models.ForeignKey(
        TipoDocumento, 
        on_delete=models.SET_NULL, 
        db_column='FK_id_tipo_documento', 
        blank=True, 
        null=True
    )
    direccion = models.CharField(max_length=255, blank=True, null=True)
    fk_id_genero = models.ForeignKey(
        Genero, 
        on_delete=models.SET_NULL, 
        db_column='FK_id_genero', 
        blank=True, 
        null=True
    )
    edad = models.IntegerField(blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    fk_codigo_municipio = models.ForeignKey(
        Ciudad, 
        on_delete=models.SET_NULL, 
        db_column='FK_codigo_municipio', 
        blank=True, 
        null=True
    )
    telefono = models.CharField(max_length=20, blank=True, null=True)
    fk_id_tipo_sangre = models.ForeignKey(
        TipoSangre, 
        on_delete=models.SET_NULL, 
        db_column='FK_id_tipo_sangre', 
        blank=True, 
        null=True
    )
    fk_id_tipo_sisben = models.ForeignKey(
        Sisben, 
        on_delete=models.SET_NULL, 
        db_column='FK_id_tipo_sisben', 
        blank=True, 
        null=True
    )
    fk_id_tipo_discapacidad = models.ForeignKey(
        Discapacidad, 
        on_delete=models.SET_NULL, 
        db_column='FK_id_tipo_discapacidad', 
        blank=True, 
        null=True
    )
    fk_id_tipo_alergia = models.ForeignKey(
        Alergia, 
        on_delete=models.SET_NULL, 
        db_column='FK_id_tipo_alergia', 
        blank=True, 
        null=True
    )
    fk_tipo_estado = models.ForeignKey(
        TipoEstado, 
        on_delete=models.SET_NULL, 
        db_column='FK_tipo_estado', 
        blank=True, 
        null=True
    )
    religion = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'estudiantes'
        verbose_name = 'Estudiante'
        verbose_name_plural = 'Estudiantes'

    def __str__(self):
        return f"{self.nombre1} {self.apellido1} - {self.numero_documento_estudiante}"

    @property
    def nombre_completo(self):
        nombres = f"{self.nombre1}"
        if self.nombre2:
            nombres += f" {self.nombre2}"
        apellidos = f"{self.apellido1}"
        if self.apellido2:
            apellidos += f" {self.apellido2}"
        return f"{nombres} {apellidos}"
    
    # Propiedades para compatibilidad con el frontend
    @property
    def numero_documento(self):
        return self.numero_documento_estudiante
    
    @property
    def primer_nombre(self):
        return self.nombre1
    
    @property
    def segundo_nombre(self):
        return self.nombre2
    
    @property
    def primer_apellido(self):
        return self.apellido1
    
    @property
    def segundo_apellido(self):
        return self.apellido2


class Profesores(models.Model):
    numero_documento_profesor = models.CharField(primary_key=True, max_length=20)
    nombre1 = models.CharField(max_length=50)
    nombre2 = models.CharField(max_length=50, blank=True, null=True)
    apellido1 = models.CharField(max_length=50)
    apellido2 = models.CharField(max_length=50, blank=True, null=True)
    correo = models.EmailField(unique=True, max_length=100)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    telefono1 = models.CharField(max_length=20, blank=True, null=True)
    telefono2 = models.CharField(max_length=20, blank=True, null=True)
    fk_id_estado = models.ForeignKey(
        TipoEstado, 
        on_delete=models.SET_NULL, 
        db_column='FK_id_estado', 
        blank=True, 
        null=True
    )
    fk_id_tipo_documento = models.ForeignKey(
        TipoDocumento, 
        on_delete=models.SET_NULL, 
        db_column='FK_id_tipo_documento', 
        blank=True, 
        null=True
    )
    fk_codigo_municipio = models.ForeignKey(
        Ciudad, 
        on_delete=models.SET_NULL, 
        db_column='FK_codigo_municipio', 
        blank=True, 
        null=True
    )
    fk_id_tipo_sangre = models.ForeignKey(
        TipoSangre, 
        on_delete=models.SET_NULL, 
        db_column='FK_id_tipo_sangre', 
        blank=True, 
        null=True
    )

    class Meta:
        db_table = 'profesores'
        verbose_name = 'Profesor'
        verbose_name_plural = 'Profesores'

    def __str__(self):
        return f"{self.nombre1} {self.apellido1} - {self.numero_documento_profesor}"

    @property
    def nombre_completo(self):
        nombres = f"{self.nombre1}"
        if self.nombre2:
            nombres += f" {self.nombre2}"
        apellidos = f"{self.apellido1}"
        if self.apellido2:
            apellidos += f" {self.apellido2}"
        return f"{nombres} {apellidos}"


class TipoAcudiente(models.Model):
    id_tipo_acudiente = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        db_table = 'tipo_acudiente'
        verbose_name = 'Tipo de Acudiente'
        verbose_name_plural = 'Tipos de Acudiente'

    def __str__(self):
        return self.descripcion


class Acudiente(models.Model):
    numero_documento_acudiente = models.CharField(primary_key=True, max_length=20)
    fk_id_tipo_documento = models.ForeignKey(
        TipoDocumento, 
        on_delete=models.SET_NULL, 
        db_column='FK_id_tipo_documento', 
        blank=True, 
        null=True
    )
    nombre1 = models.CharField(max_length=50)
    nombre2 = models.CharField(max_length=50, blank=True, null=True)
    apellido1 = models.CharField(max_length=50)
    apellido2 = models.CharField(max_length=50, blank=True, null=True)
    telefono1 = models.CharField(max_length=20, blank=True, null=True)
    telefono2 = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    fk_codigo_municipio = models.ForeignKey(
        Ciudad, 
        on_delete=models.SET_NULL, 
        db_column='FK_codigo_municipio', 
        blank=True, 
        null=True
    )

    class Meta:
        db_table = 'acudiente'
        verbose_name = 'Acudiente'
        verbose_name_plural = 'Acudientes'

    def __str__(self):
        return f"{self.nombre1} {self.apellido1} - {self.numero_documento_acudiente}"

    @property
    def nombre_completo(self):
        nombres = f"{self.nombre1}"
        if self.nombre2:
            nombres += f" {self.nombre2}"
        apellidos = f"{self.apellido1}"
        if self.apellido2:
            apellidos += f" {self.apellido2}"
        return f"{nombres} {apellidos}"


# Relación entre estudiantes y acudientes
class EstudiantesAcudientes(models.Model):
    id_estudiantes_acudientes = models.AutoField(primary_key=True)
    fk_numero_documento_acudiente = models.ForeignKey(
        Acudiente, 
        on_delete=models.CASCADE, 
        db_column='FK_numero_documento_acudiente'
    )
    fk_numero_documento_estudiante = models.ForeignKey(
        Estudiantes, 
        on_delete=models.CASCADE, 
        db_column='FK_numero_documento_estudiante'
    )
    fk_id_tipo_acudiente = models.ForeignKey(
        TipoAcudiente, 
        on_delete=models.SET_NULL, 
        db_column='FK_id_tipo_acudiente', 
        blank=True, 
        null=True
    )

    class Meta:
        db_table = 'estudiantes_acudientes'
        verbose_name = 'Estudiante-Acudiente'
        verbose_name_plural = 'Estudiantes-Acudientes'
        unique_together = (('fk_numero_documento_estudiante', 'fk_numero_documento_acudiente'),)

    def __str__(self):
        return f"{self.fk_numero_documento_estudiante} - {self.fk_numero_documento_acudiente}"
    
class TipoActividad(models.Model):
    id_tipo_actividad = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        db_table = 'tipo_actividad'
        verbose_name = 'Tipo de Actividad'
        verbose_name_plural = 'Tipos de Actividad'

    def __str__(self):
        return self.descripcion
    
class ano_electivo(models.Model) :
    id_año_electivo = models.IntegerField(primary_key=True, max_length=10)
    fecha_inicio = models.DateField(blank= True, null=True)
    fecha_fin = models.DateField(blank= True, null=True)

    class Meta:
        db_table = "ano_electivo"

    def __str__(self) :
        return self.id_año_electivo

class Cursos(models.Model) :
    id_curso = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, blank= True, null=True)
    fk_id_año_electivo = models.ForeignKey(ano_electivo, on_delete=models.CASCADE, db_column="FK_id_año_electivo")
    estado = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = "curso"

    def __str__(self) :
        return str(self.id_curso)

class Area_conocimiento(models.Model) :
    id_area_conocimiento = models.AutoField(primary_key=True, max_length=10)
    nombre = models.CharField(max_length=100, blank= True, null=True)

    class Meta:
        db_table = "area_conocimiento"

    def __str__(self) :
        return self.id_area_conocimiento


class Materias(models.Model) :
    id_materia = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, blank= True, null=True)
    porcentaje_ponderado = models.DecimalField(max_digits=5, decimal_places=2)
    fk_Id_area_conocimiento = models.ForeignKey(Area_conocimiento, on_delete=models.CASCADE, db_column="FK_Id_area_conocimiento")
    estado = models.CharField(max_length=50, default="Activo")

    class Meta:
        db_table = "materias"

    def __str__(self) :
        return self.id_materia
    
class MateriasAsignadas(models.Model) :
    id_materia_profesores = models.AutoField(primary_key=True)
    fk_numero_documento_profesor = models.ForeignKey(Profesores, on_delete=models.CASCADE, db_column="numero_documento_profesor")
    fk_id_materia = models.ForeignKey(Materias, on_delete=models.CASCADE, db_column="id_materia")
    fk_id_curso = models.ForeignKey(Cursos, on_delete=models.CASCADE, db_column="id_curso")
    fk_id_año_electivo = models.ForeignKey(ano_electivo, on_delete=models.CASCADE, db_column="id_año_electivo")
    fk_usuario_creacion = models.ForeignKey(User, on_delete=models.CASCADE, db_column="usuario_creacion", related_name="materias_creadas")

    class Meta:
        db_table = "materia_profesores"

    def __str__(self) :
        return self.id_materia_profesores

class Estudiantes_cursos(models.Model) :
    id_estudiantes_cursos = models.AutoField(primary_key=True)
    numero_documento_estudiante = models.ForeignKey(Estudiantes, on_delete=models.CASCADE, db_column="numero_documento_estudiante")
    id_curso = models.ForeignKey(Cursos, on_delete=models.CASCADE, db_column="id_curso")
    fecha_asignacion = models.DateField(auto_now_add=True, blank=True, null=True)

    class Meta:
        db_table = "estudiantes_cursos"

    def __str__(self) :
        return self.id_estudiantes_cursos

class Periodo(models.Model):
    id_periodo = models.AutoField(primary_key=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    class Meta:
        db_table = 'periodo'
        verbose_name = 'Periodo'
        verbose_name_plural = 'Periodos'

    def __str__(self):
        return f"Periodo {self.id_periodo}: {self.fecha_inicio} - {self.fecha_fin}"

class Actividades(models.Model):
    id_actividades = models.AutoField( primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    porcentaje = models.DecimalField(max_digits=5 , decimal_places=2,blank=True, null=True)
    fecha_inicio = models.DateField(blank=True, null=True)
    fecha_fin = models.DateField(blank=True, null=True)
    fk_id_tipo_actividad = models.ForeignKey(
        TipoActividad, 
        on_delete=models.CASCADE, 
        db_column='FK_id_tipo_actividad'
    )
    fk_id_periodo_academico = models.ForeignKey(
        Periodo, 
        on_delete=models.CASCADE, 
        db_column='FK_id_periodo_academico'
    )
    fk_id_materia_profesores = models.ForeignKey(
        MateriasAsignadas, 
        on_delete=models.SET_NULL, 
        db_column='FK_id_materia_profesores', 
        blank=True, 
        null=True
    )

    class Meta:
        db_table = 'actividades'
        verbose_name = 'Actividades'
        verbose_name_plural = 'Actividades'

    def __str__(self):
        return self.id_actividades

class EstudianteNotas(models.Model):
    id_estudiante_notas = models.AutoField(primary_key=True)
    fk_numero_documento_estudiante = models.ForeignKey(
        Estudiantes,
        on_delete=models.CASCADE,
        db_column='fk_numero_documento_estudiante'
    )
    fk_id_actividad = models.ForeignKey(
        Actividades,
        on_delete=models.CASCADE,
        db_column='fk_id_actividad'
    )
    calificacion = models.DecimalField(max_digits=3, decimal_places=2)  # 0.00 a 5.00

    class Meta:
        db_table = "estudiante_notas"
        unique_together = (('fk_numero_documento_estudiante', 'fk_id_actividad'),)

    def __str__(self):
        return f"{self.fk_numero_documento_estudiante} - {self.fk_id_actividad} : {self.calificacion}"
