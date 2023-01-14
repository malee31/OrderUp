#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

# Build React App
npm install
PUBLIC_URL="/react" BUILD_PATH="./build" npx --yes react-scripts build
mv ./build/* ./django/build
rmdir ./build

cd django
python manage.py migrate
python manage.py loaddata ./order/fixtures/menu-fixture.json