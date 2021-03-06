# Generated by Django 3.2.2 on 2021-06-22 22:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=30, null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='palabra',
            name='name',
        ),
        migrations.AddField(
            model_name='account',
            name='descripcion',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='account',
            name='imagenPerfil',
            field=models.ImageField(blank=True, default='images/default_user.png', null=True, upload_to='images/'),
        ),
        migrations.AddField(
            model_name='account',
            name='imagenPortada',
            field=models.ImageField(blank=True, default='images/default_portada.jpg', null=True, upload_to='images/'),
        ),
        migrations.AddField(
            model_name='account',
            name='last_name',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='account',
            name='metaDiaria',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='palabra',
            name='DiasAAgregarSiCorrecto',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='palabra',
            name='cantidadDeRepasosHastaElProximoNivel',
            field=models.BigIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='palabra',
            name='cantidadRepasos',
            field=models.PositiveIntegerField(blank=True, default=0, null=True),
        ),
        migrations.AddField(
            model_name='palabra',
            name='fechaHastaDescenderNivel',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='palabra',
            name='fechaLeidaPrimeraVez',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='palabra',
            name='fechaSiguienteRepaso',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='palabra',
            name='fechaUltimoRepaso',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='palabra',
            name='idioma',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='base.idioma'),
        ),
        migrations.AddField(
            model_name='palabra',
            name='palabra',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='palabra',
            name='traduccion',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='palabra',
            name='usuario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='palabra',
            name='dificultad',
            field=models.PositiveIntegerField(blank=True, default=0, null=True),
        ),
        migrations.AlterField(
            model_name='palabra',
            name='fechaCreacion',
            field=models.DateField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='palabra',
            name='fechaModificacion',
            field=models.DateField(auto_now=True, null=True),
        ),
        migrations.CreateModel(
            name='Texto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fechaCreacion', models.DateField(auto_now_add=True, null=True)),
                ('fechaModificacion', models.DateField(auto_now=True, null=True)),
                ('cantidadPalabras', models.BigIntegerField(blank=True, null=True)),
                ('texto', models.TextField(blank=True, max_length=100000, null=True)),
                ('audio', models.FileField(blank=True, null=True, upload_to='')),
                ('youtubeURL', models.URLField(blank=True, null=True)),
                ('imagen', models.ImageField(blank=True, null=True, upload_to='')),
                ('completado', models.BooleanField(blank=True, default=False, null=True)),
                ('fechaUltimaLectura', models.DateField(blank=True, null=True)),
                ('fechaCompletado', models.DateField(blank=True, null=True)),
                ('categoria', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='base.categoria')),
                ('idioma', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='base.idioma')),
                ('usuario', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='textos', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Desafios',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=30, null=True)),
                ('cantidadPalabras', models.BigIntegerField(null=True)),
                ('cantidadPalabrasLeidas', models.BigIntegerField(null=True)),
                ('fechaFinalizacion', models.DateField(null=True)),
                ('fechaCreacion', models.DateField(auto_now_add=True, null=True)),
                ('imagen', models.ImageField(blank=True, null=True, upload_to='')),
                ('usuario', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='palabra',
            name='texto',
            field=models.ManyToManyField(to='base.Texto'),
        ),
    ]
