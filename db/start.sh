#!/usr/bin/env bash

docker run --name db --rm --env-file example.env -p 5432:5432 -v $PWD/osm-data:/osm-data citykleta/db:latest
