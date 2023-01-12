# About OrderUp
OrderUp is a Django app built to show a made-up menu of items people can order and allow them to check them out for the "chefs" to create and deliver!  
There is no payment system in place so everything is free :D

# Deployment
The platform of choice for demo deployment was Render. The following are the steps to deploy:
1. Create a PostgreSQL database on Render (Should be straight-forward. Steps omitted)
   * All the information needed for set up will be found on the `Info` tab under `Connections` after it has been created
2. Create a new Render project through `Blueprints`
3. Select this repository
4. Add environment variables for `SECRET_KEY` and `DEBUG`.