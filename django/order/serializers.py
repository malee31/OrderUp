from rest_framework import serializers
from menu.serializers import MenuItemSerializer
from .models import Order, ItemOrder


class ItemOrderSerializer(serializers.ModelSerializer):
    item = MenuItemSerializer()

    class Meta:
        model = ItemOrder
        fields = ["item", "count"]


class OrderSerializer(serializers.ModelSerializer):
    items = ItemOrderSerializer(many=True)

    class Meta:
        model = Order
        fields = ["order_number", "fulfilled", "items"]
