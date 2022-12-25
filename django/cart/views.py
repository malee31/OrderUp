import json

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view

from order.models import Order, ItemOrder, MenuItem
from .models import Cart, CartItemOrder
from .serializers import CartSerializer


@api_view(["GET"])
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

    print(f"Info: {CartSerializer(cart).data}")
    return JsonResponse(CartSerializer(cart).data)


@api_view(["GET"])
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


@api_view(["POST"])
def sync_cart(request):
    """Syncs the Cart and all the cart related items. Assumes Cart exists for now"""
    cart_obj = json.loads(request.body)
    cart_id = cart_obj["cart_id"]
    cart_items = cart_obj["items"]
    try:
        # Get the Cart and verify that it exists
        cart = Cart.objects.get(cart_id=cart_id)
    except ObjectDoesNotExist:
        return HttpResponse(f"Cart [{cart_id}] Not Found", status=404)

    item_orders = CartItemOrder.objects.filter(cart=cart)
    print("Items located")
    # TODO: Handle item deletes (Not yet implemented on front end)
    # TODO: Test. Cannot test until menu items have been made
    for item in cart_items:
        item_id = item["item_id"]
        try:
            item_order = item_orders.all().get(item__item_id=int(item_id))
        except ObjectDoesNotExist:
            item = MenuItem.objects.get(item_id=int(item_id))
            item_order = CartItemOrder(cart=cart, item=item, count=0)
            print(f"New Cart Item Order Created For [{item.name}]")

        if item_order.count != item["count"]:
            print(f"Count Mismatch of {item_order.count} needing to sync to {item['count']}")
            item_order.count = item["count"]
            item_order.save()
            print(f"Cart Item Order Edited For [{item_order.name}]")
            print(f"Cart Contents Changed [Cart {cart_id} ← Item {item_id}[{item_order.name}] x{item_order.count}]")

    return HttpResponse("Cart Synced")


@api_view(["POST"])  # TODO: Swap with DELETE. May need to add CORs
def empty_cart(request, cart_id):
    print(f"Cart Emptied [{cart_id}]")
    CartItemOrder.objects.filter(cart__cart_id=cart_id).delete()
    # Deleting the cart itself is technically unnecessary
    # TODO: Test if the models.RESTRICT is working by uncommenting
    # Cart.objects.get(cart_id=cart_id).delete()
    return HttpResponse(f"Cart Emptied [{cart_id}]")
