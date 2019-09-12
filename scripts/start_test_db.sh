#!/usr/bin/env bash
docker run --rm --env-file $PWD/test/test.env -p 5433:5432 -v $PWD/test/fixture:/osm-data  citykleta/db:latest
