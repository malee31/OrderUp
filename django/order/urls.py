from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_order),
    path('place/<int:order_number>/', views.place_order),
    path('delete/<int:order_number>/', views.delete_order),
    path('add_item/<int:order_number>', views.add_item),
]
