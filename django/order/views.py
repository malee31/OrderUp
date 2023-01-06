import json

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view

from menu.models import MenuItem
from .models import Order, ItemOrder
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
    return HttpResponse(
        f"Successfully Changed Fulfillment Status For Order {order_obj.order_number} to {new_order_fulfill}")


@api_view(["POST"])  # TODO: Change to DELETE after checking CORS
def delete_order(request, order_number):
    print(f"Deleting Order [{order_number}]")
    Order.objects.get(order_number=order_number).delete()
    return HttpResponse(f"Order #{order_number} Deleted")


@api_view(["POST"])
def sync_order(request):
    """Syncs the Order and all the order related items. Assumes Order exists"""
    # Note: Similar to cart/views.py
    order_obj = json.loads(request.body)
    order_number = order_obj["order_number"]
    order_items = order_obj["items"]
    try:
        # Get the Order and verify that it exists
        order = Order.objects.get(order_number=order_number)
    except ObjectDoesNotExist:
        return HttpResponse(f"Order [{order_number}] Not Found", status=404)

    item_orders = ItemOrder.objects.filter(order=order)
    print("Items located for sync")
    for order_item in order_items:
        order_item_item = order_item["item"]
        item_id = order_item_item["item_id"]
        try:
            item_order = item_orders.all().get(item__item_id=int(item_id))
        except ObjectDoesNotExist:
            menuitem = MenuItem.objects.get(item_id=int(item_id))
            item_order = ItemOrder(order=order, item=menuitem, count=0)
            print(f"New Order Item Order Created For [{menuitem.name}]")

        if item_order.count != order_item["count"]:
            print(f"Count Mismatch of {item_order.count} needing to sync to {order_item['count']}")
            item_order.count = order_item["count"]
            item_order.save()
            # print(f"Order Item Order Edited For [{item_order.item.name}]")
            print(
                "Order Contents Changed "
                f"[Order {order_number} <-- Item #{item_id} - [{item_order.item.name}] x{item_order.count}]"
            )

    # Remove items that are not in the order anymore or have a count of 0
    item_orders.all().filter(count__lte=0).delete()
    item_orders.all().exclude(item__item_id__in=[order_item["item"]["item_id"] for order_item in order_items]).delete()

    return HttpResponse("Order Synced")
