from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
from django.http import HttpResponse
from order.models import Order, ItemOrder, MenuItem
from .models import Cart, CartItemOrder


def get_cart(request, cart_id):
    """Returns the current cart if it exists. Creates the card first if it doesn't"""
    # TODO: Self-chosen cart_id for now. Assign based on user in the future
    try:
        cart = Cart.objects.get(cart_id=cart_id)
        print(f"Cart located [{cart.cart_id}]")
    except ObjectDoesNotExist:
        cart = Cart(cart_id=cart_id)
        cart.save()
        print(f"New cart created [{cart.cart_id}]")

    return HttpResponse(serializers.serialize("json", cart))


def place_order(request, cart_id):
    """Finalizes and places cart as an order"""
    # Convert all cart items into order items
    print(f"Attempting to place [{cart_id}] as an Order")

    # Creates a new order
    finalized_order = Order()
    finalized_order.save()
    for itemEntry in Cart.objects.get(cart_id=cart_id).items:
        print(f"Moving Item From Cart: [{itemEntry.item.name}]")
        order_item = ItemOrder(order=finalized_order, item=itemEntry.item, count=itemEntry.count)
        order_item.save()

    # Convert all cart items into order items
    print(f"Attempting to place [{cart_id}] as an Order")
    return HttpResponse(f"Cart Placed As Order [{finalized_order.order_number}]")


def add_item(request, cart_id, item_id):
    """Adds an item to the order. Changes the number of items if the item is already in the order"""
    try:
        item_order = CartItemOrder.objects.get(cart__cart_id=cart_id)
        print(f"Item located [{item_order.item.name}]")
    except ObjectDoesNotExist:
        cart = Cart.objects.get(cart_id=cart_id)
        item = MenuItem.objects.get(item_id=item_id)
        item_order = CartItemOrder(cart=cart, item=item, count=0)
        print(f"New Cart Item Order Created For [{item.name}]")

    item_order.count += 1
    item_order.save()
    print(f"Cart Contents Changed [Cart {cart_id} ← Item {item_id} x{item_order.count}]")
    return HttpResponse("Order Added")


def empty_cart(request, cart_id):
    print(f"Cart Emptied [{cart_id}]")
    CartItemOrder.objects.filter(cart__cart_id=cart_id).delete()
    # Deleting the cart itself is technically unnecessary
    # TODO: Test if the models.RESTRICT is working by uncommenting
    # Cart.objects.get(cart_id=cart_id).delete()
    return HttpResponse(f"Cart Emptied [{cart_id}]")
