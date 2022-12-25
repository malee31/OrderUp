# Generated by Django 4.1.4 on 2022-12-25 08:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0002_alter_cartitemorder_item'),
        ('menu', '0001_initial'),
        ('order', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itemorder',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='menu.menuitem'),
        ),
        migrations.DeleteModel(
            name='MenuItem',
        ),
    ]
