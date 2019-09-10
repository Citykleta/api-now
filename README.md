# api-now

[![CircleCI](https://circleci.com/gh/Citykleta/api-now.svg?style=svg)](https://circleci.com/gh/Citykleta/api-now)

# Getting started (Developer - offline support)

## prerequisites

### software

You need to have installed on your machine [Docker]() in order to run a database and a tile server.
[Nodejs]() must be installed too in order to run the web API

### data fixture

If you want the API to return relevant results you should download an open street map data set for La Habana

with curl:
```sh
curl ... ./scripts/data/havana.osm
```

In the same way you should download tiles for La Habana so you can work on your map even when you are offline (note the tile server used in production will be different)

with curl:
```sh
cu
```

### Installation

1. Install Nodejs dependencies by running ``npm install``

2. Start the database with ``./scripts/start_dev_db.sh`` (you might have to set this file executable first)
On UNIX
```sh
chmod +x ./scripts/start_dev_db.sh
```
If everything is fine and you have correctly configured your data fixture should see something like the screen shot below
![database log](./media/db_log.png)

Note the number of items "INSERTED"

3. Start the tile server by running ``./scripts/start_tile_server.sh`` (in the same way you should make sure the file is executable before)
If everything is fine you can open a browser with the url [http://localhost:8080](http://localhost:8080) and should see an application to view different types of Havana map
![tile server screenshot](./media/tile_server.png)

4. Build the application by running ``npm run build``. You can now watch for file changes and automatically build the app thanks to ``npm run build:watch``

5. Start now a dev server ``node ./scripts/dev_server.js`` (or with nodemon if you do not want to restart the server on every file change)
If everything is fine go to [http://localhost:3000/poi?search=edificio](http://localhost:3000/poi?search=edificio) and you should see some data
![api check sreenshot](./media/api_check.png)






 



 