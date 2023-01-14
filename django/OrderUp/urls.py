"""OrderUp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.shortcuts import render
from django.urls import path, re_path, include
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),  # Default admin urls
    path('api-auth/', include('rest_framework.urls')),  # Default Django Rest Framework urls

    # Paths to other parts of the app
    path('menu/', include('menu.urls')),  # All things menu related
    path('cart/', include('cart.urls')),  # All things cart related
    path('order/', include('order.urls')),  # All things order related
    re_path(r'^react/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]


def handler404(request, *args, **kwargs):
    return render(request, "index.html")
