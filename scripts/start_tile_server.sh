#!/usr/bin/env bash
docker run --name tiles --rm -p 8080:80 -v $PWD/scripts/data:/data klokantech/tileserver-gl