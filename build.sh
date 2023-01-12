#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

cd django
python manage.py migrate
python manage.py loaddata ./order/fixtures/menu-fixture.json