# Generated by Django 3.2.2 on 2021-07-12 20:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0015_alter_texto_imagen'),
    ]

    operations = [
        migrations.AlterField(
            model_name='texto',
            name='imagen',
            field=models.ImageField(blank=True, default='images/default_libro.png', null=True, upload_to='images/'),
        ),
    ]
