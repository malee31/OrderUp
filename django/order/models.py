from django.db import models


class MenuItem(models.Model):
    item_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=False, blank=False)
    description = models.CharField(max_length=300, default="")


class Order(models.Model):
    order_number = models.AutoField(primary_key=True)
    fulfilled = models.BooleanField(null=False, blank=False, default=False)
    # Use Order.items to access all ItemOrder instances


class ItemOrderTemplate(models.Model):
    item = models.ForeignKey(MenuItem, models.RESTRICT, null=False, blank=False)
    count = models.PositiveIntegerField(default=0, null=False, blank=False)

    class Meta:
        abstract = True


class ItemOrder(ItemOrderTemplate):
    order = models.ForeignKey(Order, models.CASCADE, null=False, blank=False, related_name="items")
