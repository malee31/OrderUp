from django.db import models


class MenuItem(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    description = models.CharField(max_length=300, default="")


class Order(models.Model):
    order_number = models.AutoField(primary_key=True)
    placed = models.BooleanField(null=False, blank=False, default=False)
    fulfilled = models.BooleanField(null=False, blank=False, default=False)
    # Use Order.items to access all ItemOrder instances


class ItemOrder(models.Model):
    item = models.ForeignKey(MenuItem, models.RESTRICT, null=False, blank=False)
    count = models.PositiveIntegerField(default=0, null=False, blank=False)
    # TODO: Check if adding not null or blank is possible
    order = models.ForeignKey(Order, models.CASCADE, related_name="items")
