from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_order),
    path('delete/<int:order_id>/', views.delete_order),
]
