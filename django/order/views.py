import json

from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from .models import Order
from .serializers import OrderSerializer


@api_view(["GET"])
def list_order(request):
    all_orders = Order.objects.all()
    return JsonResponse({
        "orders": OrderSerializer(all_orders, many=True).data
    })


@api_view(["POST"])
def change_fulfill(request, order_number):
    new_order_obj = json.loads(request.body)
    new_order_fulfill = new_order_obj["fulfilled"]
    order_obj = Order.objects.get(order_number=order_number)
    order_obj.fulfilled = new_order_fulfill
    order_obj.save()
    return HttpResponse(f"Successfully Changed Fulfillment Status For Order {order_obj.order_number} to {new_order_fulfill}")


@api_view(["POST"])  # Unused unless a staff section is created
def add_item(request, order_number, item_id):
    """Adds an item to the order. Changes the number of items if the item is already in the order"""
    print(f"Adding Item to Order [Order {order_number} ← Item {item_id}]")
    order_obj = Order.objects.get(order_number=order_number)
    return HttpResponse("Order Added")


@api_view(["POST"])  # TODO: Change to DELETE after checking CORS
def delete_order(request, order_number):
    print(f"Deleting Order [{order_number}]")
    Order.objects.get(order_number=order_number).delete()
    return HttpResponse(f"Order #{order_number} Deleted")
