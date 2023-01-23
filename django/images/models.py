from django.db import models
from datetime import datetime


def generate_filepath(instance, filename):
    return f"{datetime.now().strftime('%Y-%m-%d')}-{instance.image_name}.{filename.split('.').pop()}"


class Image(models.Model):
    image_id = models.AutoField(primary_key=True)
    timestamp = models.TimeField(auto_now_add=True)
    image_name = models.CharField(max_length=100, null=False)
    location = models.FileField(upload_to=generate_filepath)
