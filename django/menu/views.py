import json

from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view

from .models import MenuItem
from .serializers import MenuItemSerializer


@api_view(["POST"])
def add_menuitem(request):
    """Adds a menu item"""
    menuitem_obj = json.loads(request.body)
    menuitem_name = menuitem_obj["name"]
    menuitem_desc = menuitem_obj["description"]
    new_menuitem = MenuItem(name=menuitem_name, description=menuitem_desc)
    new_menuitem.save()

    return HttpResponse("Menu Item Added")


@api_view(["GET"])
def list_menuitem(request):
    all_menuitems = MenuItem.objects.all()
    return JsonResponse({
        "items": MenuItemSerializer(all_menuitems, many=True).data
    })
