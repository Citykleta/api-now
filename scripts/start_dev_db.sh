#!/usr/bin/env bash
docker run --name db --rm --env-file $PWD/db/example.env -p 5432:5432 -v $PWD/scripts/data:/osm-data citykleta/db:latest
