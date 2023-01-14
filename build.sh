#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

PUBLIC_URL="/react" BUILD_PATH="./django/build" npx --yes react-scripts build

cd django
python manage.py migrate
python manage.py loaddata ./order/fixtures/menu-fixture.json