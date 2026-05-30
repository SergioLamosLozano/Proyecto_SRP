# Generated manually for Acudiente.fk_id_estado

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_periodo_estado'),
    ]

    operations = [
        migrations.AddField(
            model_name='acudiente',
            name='fk_id_estado',
            field=models.ForeignKey(
                blank=True,
                null=True,
                db_column='FK_id_estado',
                on_delete=django.db.models.deletion.SET_NULL,
                to='core.tipoestado',
                help_text='Estado del acudiente (Activo/Inactivo)',
            ),
        ),
    ]
