"""
Signals que mantienen las definitivas sincronizadas con las notas.

Cada vez que un docente crea, modifica o borra una nota, recalculamos
automáticamente la definitiva del estudiante en esa materia y periodo.
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models_db import EstudianteNotas
from .definitivas_utils import invalidar_definitivas_por_nota


@receiver(post_save, sender=EstudianteNotas)
def _on_nota_guardada(sender, instance, created, **kwargs):
    invalidar_definitivas_por_nota(instance)


@receiver(post_delete, sender=EstudianteNotas)
def _on_nota_borrada(sender, instance, **kwargs):
    invalidar_definitivas_por_nota(instance)
