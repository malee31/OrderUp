from django.urls import path

from . import views

urlpatterns = [
    path('upload', views.upload_image),
    path('list/full', views.list_all_images),
    path('list', views.list_images)
]
