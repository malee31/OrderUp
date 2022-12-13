from django.db import models


class Order(models.Model):
    order_number = models.BigIntegerField(null=False, blank=False)
    fulfilled = models.BooleanField(null=False, blank=False)

    # TODO: Change to ArrayField type when using PostgreSQL
