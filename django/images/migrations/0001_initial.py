# Generated by Django 4.1.4 on 2023-01-22 11:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('image_id', models.AutoField(primary_key=True, serialize=False)),
                ('timestamp', models.TimeField(auto_now_add=True)),
                ('location', models.FileField(upload_to='%Y/%m/%d/')),
            ],
        ),
    ]
