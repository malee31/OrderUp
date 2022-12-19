from django.urls import path
from . import views

urlpatterns = [
    path('<str:cart_id>/', views.get_cart),
    path('place/<str:cart_id>/', views.place_order),
    path('add_item/<str:cart_id>/<int:item_id>', views.add_item),
]
