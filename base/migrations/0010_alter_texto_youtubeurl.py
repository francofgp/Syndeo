# Generated by Django 3.2.2 on 2021-07-05 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_alter_texto_nombre'),
    ]

    operations = [
        migrations.AlterField(
            model_name='texto',
            name='youtubeURL',
            field=models.CharField(max_length=300, null=True),
        ),
    ]
