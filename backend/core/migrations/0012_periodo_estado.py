# Generated manually for Periodo.estado (soft-delete)

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_periodo_nombre_anoelectivo'),
    ]

    operations = [
        migrations.AddField(
            model_name='periodo',
            name='estado',
            field=models.CharField(
                max_length=20,
                default='activo',
                help_text='activo | inactivo (soft-delete)',
            ),
        ),
    ]
