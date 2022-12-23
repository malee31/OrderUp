from rest_framework import serializers
from .models import Cart, CartItemOrder


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ["cart_id", "items"]


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItemOrder
        fields = ["item", "count"]
