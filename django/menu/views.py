import json

from django.http import HttpResponse
from rest_framework.decorators import api_view

from .models import MenuItem


@api_view(["POST"])
def add_menuitem(request):
    """Adds a menu item"""
    menuitem_obj = json.loads(request.body)
    menuitem_name = menuitem_obj["name"]
    menuitem_desc = menuitem_obj["description"]
    new_menuitem = MenuItem(name=menuitem_name, description=menuitem_desc)
    new_menuitem.save()

    return HttpResponse("Menu Item Added")
