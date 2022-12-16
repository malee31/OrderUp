from django.http import HttpResponse
from .models import Order


def create_order(request):
    """Creates a new order and returns the assigned order number"""
    new_order = Order()  # TODO: Manually assigning order numbers
    new_order.save()
    print(f"New order created [{new_order.order_number}]")
    return HttpResponse(new_order.order_number)


def place_order(request, order_number):
    """Finalizes and places a pre-existing unplaced order"""
    print(f"Order placed [{order_number}]")
    pass


def add_item(request, order_number, item_id):
    """Adds an item to the order. Changes the number of items if the item is already in the order"""
    print(f"Item added to order [Order {order_number} ← Item {item_id}]")
    return HttpResponse("Order Added")


def delete_order(request, order_number):
    print(f"Order deleted [{order_number}]")
    return HttpResponse(f"Order Deleted {order_number}")
