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

    # print(f"Info: {CartSerializer(cart).data}")
    return JsonResponse(CartSerializer(cart).data)


@api_view(["GET"])
def place_order(request, cart_id):
    """Finalizes and places cart as an order"""
    # Convert all cart items into order items
    print(f"Attempting to place [{cart_id}] as an Order")

    # Creates a new order
    finalized_order = Order()
    finalized_order.save()
    cart_obj = Cart.objects.get(cart_id=cart_id)
    for itemEntry in list(cart_obj.items.all()):
        print(f"Moving Item From Cart: [{itemEntry.item.name}]")
        order_item = ItemOrder(order=finalized_order, item=itemEntry.item, count=itemEntry.count)
        order_item.save()

    # Converted all cart items into order items
    print(f"Placed [{cart_id}] as an Order")
    # Empty the cart. Cart itself is not deleted
    # Note: No indication is sent to the front end to empty the cart
    #       Remember to reload the cart or re-empty it there to match
    cart_obj.items.all().delete()

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
    print("Items located for sync")
    # TODO: Handle item deletes (Not yet implemented on front end)
    # TODO: Test. Cannot test until menu items have been made
    for cart_item in cart_items:
        cart_item_item = cart_item["item"]
        item_id = cart_item_item["item_id"]
        try:
            item_order = item_orders.all().get(item__item_id=int(item_id))
        except ObjectDoesNotExist:
            menuitem = MenuItem.objects.get(item_id=int(item_id))
            item_order = CartItemOrder(cart=cart, item=menuitem, count=0)
            print(f"New Cart Item Order Created For [{menuitem.name}]")

        if item_order.count != cart_item["count"]:
            print(f"Count Mismatch of {item_order.count} needing to sync to {cart_item['count']}")
            item_order.count = cart_item["count"]
            item_order.save()
            # print(f"Cart Item Order Edited For [{item_order.item.name}]")
            print(f"Cart Contents Changed [Cart {cart_id} <-- Item #{item_id} - [{item_order.item.name}] x{item_order.count}]")

    # Remove items that are not in cart or have a count of 0
    item_orders.all().filter(count__lte=0).delete()
    item_orders.all().exclude(item__item_id__in=[cart_item["item"]["item_id"] for cart_item in cart_items]).delete()

    return HttpResponse("Cart Synced")


@api_view(["POST"])  # TODO: Swap with DELETE. May need to add CORs
def empty_cart(request, cart_id):
    print(f"Cart Emptied [{cart_id}]")
    CartItemOrder.objects.filter(cart__cart_id=cart_id).delete()
    # Deleting the cart itself is technically unnecessary
    # TODO: Test if the models.RESTRICT is working by uncommenting
    # Cart.objects.get(cart_id=cart_id).delete()
    return HttpResponse(f"Cart Emptied [{cart_id}]")
