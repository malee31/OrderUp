# About OrderUp
OrderUp is a Django app built to show a made-up menu of items people can order and allow them to check them out for the "chefs" to create and deliver!  
There is no payment system in place so everything is free :D

## Deployment
The platform of choice for demo deployment was Render. The following sections are the steps to deploy

## Render Deployment (Paid: Blueprints)
1. Create a new Render project through `Blueprints`
2. Select this repository
3. Add a name and details, and it should be theoretically done (Untested)

## Render Deployment (Free: Manual)
1. Create a PostgreSQL database on Render
   * (optional) Like in the blueprint `render.yaml`, you may use the following settings:
     * Name: `OrderUp Database`
     * PostgreSQL Version: `15` (Higher might work, but this project was built and tested on v15)
     * Database: `orderup_db`
     * Username: `orderup_admin`
   * All the information needed for set up will be found on the `Info` tab under `Connections` after it has been created
2. Create a new `Web Service` and connect it to this repository
3. Choose `Python 3` as the environment of choice
4. Set the build script as `./build.sh`
5. Set the start script as `cd django && gunicorn OrderUp.wsgi:application`
6. Open `Advanced` and set the following environment variables:
   * Set `PYTHON_VERSION` environment variable to `3.8.2` or a higher Python version number for Render (Default is 3.7 which isn't high enough)
   * Set `DEBUG` to `False`
     * You may use `True` during the first test deployment but the React frontend will only display at `/react/index.html` and other pages will be Django 404s
   * Set the `SECRET_KEY` to the Django `SECRET_KEY`
   * Set `ALLOWED_HOSTS` to a comma-separated list of allowed hosts
     * After creating the `Web Service`, Render will also provide you an `[project-name].onrender.com` url, so you should include that through editing in the `Environment` tab after these instructions end or none of the backend will work
7. Click `Create Web Service` and it's done!