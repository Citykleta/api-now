#!/usr/bin/env bash
docker run --rm --env-file $PWD/test/test.env -p 5432:5432 -v $PWD/test/fixture:/osm-data  citykleta/db:latest
