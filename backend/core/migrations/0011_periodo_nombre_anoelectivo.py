# Generated manually for Periodo: nombre + fk_id_año_electivo

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_configuracionboletines'),
    ]

    operations = [
        migrations.AddField(
            model_name='periodo',
            name='nombre',
            field=models.CharField(
                max_length=100,
                blank=True,
                null=True,
                help_text="Nombre descriptivo del periodo (ej: 'Primer Trimestre 2026')",
            ),
        ),
        migrations.AddField(
            model_name='periodo',
            name='fk_id_año_electivo',
            field=models.ForeignKey(
                blank=True,
                null=True,
                db_column='FK_id_año_electivo',
                on_delete=django.db.models.deletion.CASCADE,
                to='core.ano_electivo',
                help_text='Año electivo al que pertenece el periodo',
            ),
        ),
    ]
