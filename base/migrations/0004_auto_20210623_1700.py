# Generated by Django 3.2.2 on 2021-06-23 20:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_alter_account_pais'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='first_name',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='pais',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]