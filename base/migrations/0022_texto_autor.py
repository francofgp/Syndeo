# Generated by Django 3.2.2 on 2021-08-20 15:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0021_account_sexo'),
    ]

    operations = [
        migrations.AddField(
            model_name='texto',
            name='autor',
            field=models.CharField(blank=True, default='', max_length=30, null=True),
        ),
    ]
