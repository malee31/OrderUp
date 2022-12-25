from django.urls import path
from . import views

urlpatterns = [
    path('<str:cart_id>/', views.get_cart),
    path('place/<str:cart_id>/', views.place_order),
    path('sync', views.sync_cart),
]
