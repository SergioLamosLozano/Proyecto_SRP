# Generated manually for ConfiguracionBoletines model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0009_definitivas_fk_id_periodo_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ConfiguracionBoletines',
            fields=[
                ('id_configuracion', models.AutoField(primary_key=True, serialize=False)),
                ('descarga_habilitada', models.BooleanField(default=True, help_text='Habilita o deshabilita la descarga de boletines para padres/acudientes')),
                ('fecha_modificacion', models.DateTimeField(auto_now=True, help_text='Fecha de última modificación')),
                ('fk_usuario_modificacion', models.ForeignKey(blank=True, db_column='fk_usuario_modificacion', help_text='Usuario que realizó la última modificación', null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Configuración de Boletines',
                'verbose_name_plural': 'Configuración de Boletines',
                'db_table': 'configuracion_boletines',
            },
        ),
    ]
