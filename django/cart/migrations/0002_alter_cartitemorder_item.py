# Generated by Django 4.1.4 on 2022-12-25 08:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0001_initial'),
        ('cart', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cartitemorder',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='menu.menuitem'),
        ),
    ]
