from django.urls import path
from . import views

urlpatterns = [
    path('sync', views.sync_cart),
    path('view/<str:cart_id>', views.get_cart),
    path('place/<str:cart_id>', views.place_order),
]
