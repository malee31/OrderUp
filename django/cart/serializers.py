from rest_framework import serializers

from menu.serializers import MenuItemSerializer
from .models import Cart, CartItemOrder


class CartItemSerializer(serializers.ModelSerializer):
    item = MenuItemSerializer()

    class Meta:
        model = CartItemOrder
        fields = ["item", "count"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ["cart_id", "items"]
