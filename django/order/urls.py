from django.urls import path
from . import views

urlpatterns = [
    path('list', views.list_order),
    path('delete/<int:order_number>', views.delete_order),
    path('add_item/<int:order_number>', views.add_item),
]
