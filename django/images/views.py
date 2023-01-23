from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view

from .models import Image
from .serializers import ImageSerializer


@api_view(["POST"])
def upload_image(request):
    """Saves a new Image"""
    new_image = Image(location=request.data["fileUpload"], image_name=request.data["fileName"])
    new_image.save()
    return HttpResponse("Image Uploaded")


@api_view(["GET"])
def list_images(request):
    all_images = Image.objects.all()
    return JsonResponse({
        "images": ImageSerializer(all_images, many=True).data
    })
