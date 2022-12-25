from django.urls import path
from . import views

urlpatterns = [
    path('add', views.add_menuitem),
    path('list', views.list_menuitem)
]
