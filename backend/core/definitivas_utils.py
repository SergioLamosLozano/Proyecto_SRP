"""
Utilidades centralizadas para el cálculo de definitivas.

FÓRMULA OFICIAL del proyecto:

    definitiva_estudiante_materia_periodo =
        Σ (calificacion × %actividad/100 × %RA/100)

    estado = "aprobado" si definitiva >= 3.0 sino "reprobado"

Reglas adicionales:
- Solo se incluyen actividades que pertenecen al RA del periodo y materia.
- Se usa exactamente la materia (id_materia) y periodo de la definitiva.
- El estudiante debe estar matriculado en el curso (estudiantes_cursos).
- La definitiva se trunca/redondea a 2 decimales y se acota a [0, 5].
"""
from decimal import Decimal, ROUND_HALF_UP
from .models_db import (
    EstudianteNotas,
    Estudiantes_cursos,
    Definitivas,
    Materias,
)

UMBRAL_APROBACION = Decimal('3.00')
DEF_MIN = Decimal('0.00')
DEF_MAX = Decimal('5.00')


def _round2(d):
    return Decimal(str(d)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def calcular_definitiva(documento_estudiante, id_materia, id_periodo):
    """
    Calcula al vuelo la definitiva de un estudiante en una materia y periodo.

    Devuelve dict:
        {
            "valor": Decimal('4.25'),
            "estado": "aprobado",
            "tiene_notas": True,
            "id_estudiantes_cursos": 12  # int o None si no está matriculado
        }
    Si no tiene ninguna nota devuelve valor=0.00 y tiene_notas=False.
    """
    notas = EstudianteNotas.objects.filter(
        fk_numero_documento_estudiante=documento_estudiante,
        fk_id_actividad__fk_id_ra__fk_id_materia_profesores__fk_id_materia=id_materia,
        fk_id_actividad__fk_id_ra__fk_id_periodo_academico=id_periodo,
    ).select_related(
        'fk_id_actividad',
        'fk_id_actividad__fk_id_ra',
    )

    suma = Decimal('0')
    tiene_notas = False
    for nota in notas:
        cal = Decimal(str(nota.calificacion or 0))
        actividad = nota.fk_id_actividad
        if actividad is None:
            continue
        ra = actividad.fk_id_ra
        if ra is None:
            continue
        p_act = Decimal(str(actividad.porcentaje or 0)) / Decimal('100')
        p_ra = Decimal(str(ra.porcentaje or 0)) / Decimal('100')
        suma += cal * p_act * p_ra
        tiene_notas = True

    valor = _round2(suma)
    if valor < DEF_MIN:
        valor = DEF_MIN
    if valor > DEF_MAX:
        valor = DEF_MAX

    estado = 'aprobado' if valor >= UMBRAL_APROBACION else 'reprobado'

    # Buscar la matrícula del estudiante para asociar la definitiva
    # Si tiene varios cursos activos, tomamos el primero activo.
    ec = Estudiantes_cursos.objects.filter(
        numero_documento_estudiante=documento_estudiante,
    ).order_by('-id_estudiantes_cursos').first()

    return {
        "valor": valor,
        "estado": estado,
        "tiene_notas": tiene_notas,
        "id_estudiantes_cursos": ec.id_estudiantes_cursos if ec else None,
    }


def upsert_definitiva(documento_estudiante, id_materia, id_periodo,
                      borrar_si_sin_notas=True):
    """
    Calcula y persiste la definitiva. Si no hay notas:
        - Si borrar_si_sin_notas=True: elimina la definitiva existente (si la había)
        - Si False: no hace nada.
    Devuelve la instancia Definitivas (o None si fue borrada / no se crea).
    """
    res = calcular_definitiva(documento_estudiante, id_materia, id_periodo)
    if res["id_estudiantes_cursos"] is None:
        return None

    if not res["tiene_notas"]:
        if borrar_si_sin_notas:
            Definitivas.objects.filter(
                fk_id_estudiantes_cursos_id=res["id_estudiantes_cursos"],
                fk_id_materia_id=id_materia,
                fk_id_periodo_id=id_periodo,
            ).delete()
        return None

    obj, _created = Definitivas.objects.update_or_create(
        fk_id_estudiantes_cursos_id=res["id_estudiantes_cursos"],
        fk_id_materia_id=id_materia,
        fk_id_periodo_id=id_periodo,
        defaults={
            "valor_definitiva": res["valor"],
            "estado": res["estado"],
        },
    )
    return obj


def recalcular_definitivas_curso(id_curso, id_materia, id_periodo):
    """
    Recalcula y persiste las definitivas de TODOS los estudiantes de un curso
    para una materia y periodo dados. Devuelve la lista de definitivas (instancias).
    """
    estudiantes_cursos = Estudiantes_cursos.objects.filter(
        id_curso_id=id_curso,
        estado='activo',
    ).select_related('numero_documento_estudiante')

    resultado = []
    for ec in estudiantes_cursos:
        doc = ec.numero_documento_estudiante.numero_documento_estudiante
        obj = upsert_definitiva(doc, id_materia, id_periodo)
        if obj is not None:
            resultado.append(obj)
    return resultado


def invalidar_definitivas_por_nota(estudiante_nota_instance):
    """
    Hook para signals: dada una EstudianteNotas, recalcula la definitiva
    correspondiente (estudiante + materia + periodo de esa nota).
    Tolerante a fallos: nunca debe romper el flujo de guardado de la nota.
    """
    try:
        actividad = estudiante_nota_instance.fk_id_actividad
        if actividad is None:
            return
        ra = actividad.fk_id_ra
        if ra is None:
            return
        mp = ra.fk_id_materia_profesores
        if mp is None:
            return
        id_materia = mp.fk_id_materia_id
        id_periodo = ra.fk_id_periodo_academico_id
        documento = estudiante_nota_instance.fk_numero_documento_estudiante_id
        upsert_definitiva(documento, id_materia, id_periodo)
    except Exception as e:
        # Logear pero no propagar
        import logging
        logging.getLogger(__name__).warning(
            f"No se pudo recalcular definitiva tras cambio de nota: {e}"
        )
