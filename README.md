# About OrderUp
OrderUp is a Django app built to show a made-up menu of items people can order and allow them to check them out for the "chefs" to create and deliver!  
There is no payment system in place so everything is free :D

## Deployment
The platform of choice for demo deployment was Render. The following are the steps to deploy:

## Render Deployment (Paid: Blueprints)
1. Create a new Render project through `Blueprints`
2. Select this repository
3. Add a name and details, and it should be theoretically done

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
4. Set environment variables (TBA)
   * Set `PYTHON_VERSION` environment variable to `3.8.2` or a higher Python version number for Render (Default is 3.7 which isn't high enough)
5. Set the build script as `./build.sh`
6. Set the start script as `cd django && gunicorn OrderUp.wsgi:application`
7. Done!