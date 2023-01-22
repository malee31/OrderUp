import os.path
from os import getenv
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables (Env file should be in the repository root with a relative path of ../.env)
load_dotenv()
# Set base directory for absolute path creation
BASE_DIR = Path(__file__).resolve().parent.parent

# Django development settings
# WARNING: Keep SECRET_KEY a secret and regenerate or make up a new one if exposed
SECRET_KEY = getenv("SECRET_KEY")
DEBUG = getenv("DEBUG", default="False") == "True"

# Django site configurations
ALLOWED_HOSTS = getenv("ALLOWED_HOSTS", default="").split(",")
APPEND_SLASH = False
ROOT_URLCONF = 'OrderUp.urls'
WSGI_APPLICATION = 'OrderUp.wsgi.application'

# Django app, plugins, and middleware configurations
INSTALLED_APPS = [
    'menu',
    'cart',
    'order',
    'rest_framework',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'storages'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Template loading (For this project, the React 'django/build/index.html' is loaded in production)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "build"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ]
        }
    }
]

# Database configurations
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
# Default primary key auto field type for implied ids
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Generated file configurations
# Static files (For this project, it is all the React build files)
STATIC_URL = '/react/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = []
# Media files (For this project, it is all the optional menu item images)
MEDIA_URL = '/mediafiles/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'mediafiles')

# React build overrides applied if 'django/build' exists
REACT_BUILD_FOUND = os.path.isdir(BASE_DIR / "build")
if not REACT_BUILD_FOUND:
    print("Warning: No 'django/build' static folder found for STATICFILES_DIRS. Omitting React build from Django.")
    print("^^^^^^^  This is safe to ignore in development. In production, 'build.sh' should create it")
else:
    STATICFILES_DIRS = [os.path.join(BASE_DIR / "build")]

# Django internationalization metadata for translations (Unused)
# https://docs.djangoproject.com/en/4.1/topics/i18n/
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Other unchanged default Django configurations
# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Django Rest Framework Settings
REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        # 'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}
