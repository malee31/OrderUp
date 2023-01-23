from django.db import models
from datetime import datetime


def generate_filepath(instance, filename):
    file_parts = filename.split('.')
    file_extension = file_parts.pop()
    file_name = instance.image_name or file_parts.join(".")
    return f"{datetime.now().strftime('%Y-%m-%d')}-{file_name}.{file_extension}"


class Image(models.Model):
    image_id = models.AutoField(primary_key=True)
    timestamp = models.TimeField(auto_now_add=True)
    image_name = models.CharField(max_length=100, null=False)
    location = models.FileField(upload_to=generate_filepath)
