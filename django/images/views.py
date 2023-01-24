from django.conf import settings
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
import boto3
from botocore.config import Config

from .models import Image
from .serializers import ImageSerializer

if settings.S3_ENABLED:
    session = boto3.session.Session()
    boto_client = session.client("s3",
                                 config=Config(s3={'addressing_style': 'virtual'}),
                                 # Configures to use subdomain/virtual calling format.
                                 region_name=settings.AWS_S3_REGION_NAME,
                                 endpoint_url=settings.AWS_S3_REGION_ENDPOINT_URL,
                                 aws_access_key_id=settings.AWS_S3_ACCESS_KEY_ID,
                                 aws_secret_access_key=settings.AWS_S3_SECRET_ACCESS_KEY
                                 )


@api_view(["POST"])
def upload_image(request):
    """Saves a new Image"""
    new_image = Image(location=request.data["fileUpload"], image_name=request.data["fileName"])
    new_image.save()
    return HttpResponse("Image Uploaded")


@api_view(["GET"])
def list_all_images(request):
    if not settings.S3_ENABLED:
        return JsonResponse({
            "error": "Storage in S3 is disabled",
            "images": []
        })

    response = boto_client.list_objects(Bucket=settings.AWS_STORAGE_BUCKET_NAME)

    all_s3_images = [key["Key"] for key in response['Contents']]
    all_s3_images_no_prefix = [s3_image[len(settings.AWS_STORAGE_BUCKET_NAME) + 1:] for s3_image in all_s3_images]
    return JsonResponse({
        "images": all_s3_images_no_prefix
    })


@api_view(["GET"])
def list_images(request):
    all_images = Image.objects.all()
    return JsonResponse({
        "images": ImageSerializer(all_images, many=True).data
    })
