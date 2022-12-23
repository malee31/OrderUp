from django.core import serializers
from django.db import models
from order.models import ItemOrderTemplate


class Cart(models.Model):
    cart_id = models.CharField(max_length=100, null=False, blank=False, unique=True)
    # Use Cart.items to access all CartItemOrder instances


class CartItemOrder(ItemOrderTemplate):
    cart = models.ForeignKey(Cart, models.CASCADE, null=False, blank=False, related_name="items")


# class CartSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Cart
#         fields = ("cart_id", "items")