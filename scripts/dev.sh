#!/usr/bin/env bash

## same result can be achieved with docker-compose

#tiles server
docker run -d --name tiles --rm  -p 8080:80 -v $PWD/scripts/data:/data klokantech/tileserver-gl;
#dev db
docker run -d --name db --rm --env-file $PWD/db/example.env -p 5432:5432 -v $PWD/scripts/data:/osm-data citykleta/db:latest;
#test db
docker run -d --name test-db --rm --env-file $PWD/test/test.env -p 5433:5432 -v $PWD/test/fixture:/osm-data  citykleta/db:latest;

node ./scripts/dev_server.js
#npm run build:watch & $PWD/node_modules/.bin/nodemon -w $PWD/src $PWD/scripts/dev_server.js;