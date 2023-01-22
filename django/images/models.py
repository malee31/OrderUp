from django.db import models


class Image(models.Model):
    image_id = models.AutoField(primary_key=True)
    timestamp = models.TimeField(auto_now_add=True)
    location = models.FileField(upload_to="%Y/%m/%d/")
