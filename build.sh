#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

# Build React App
npm install
PUBLIC_URL="/react" BUILD_PATH="./build" npm run build
rsync -r ./build/ ./django/build
mv ./build/* ./django/build
rmdir ./build

cd django
python manage.py migrate
python manage.py loaddata ./order/fixtures/menu-fixture.json