# Database for La Habana geo-coder

The db directory contains everything required to run a [PostgresSQL]() database tailored for geo coding backend:

* [A set of sql function](./functions) to perform searches and reverse searches
* [A set of sql scripts](./schema) required to perform schema migrations and data import
* [Dictionaries](./dictionaries) used to perform efficient [full text search]()
* [Automation scripts](./scripts) for common maintenance and setup tasks.

## Usage

### With docker

The easiest way to get started is to use the latest [docker image]() which comes with everything (except the data) included

1. Load the data in a new folder ``mkdir -p ./db/osm-data && curl ...``
2. Start the docker container ``docker run --rm --name some_container_name -e POSTGRES_DB=somedb -e POSTGRES_USER=someuser -e POSTGRES_PASSWORD=somepassword -p 5432:5432 -v path/to/your/osm-data/:/osm-data citykleta/db``

The docker image extends the official [postgres image]() and exposes the same environment variable.

Note: the data used by the database is actually the same dataset as the one provided by open street and meant mostly as a read access only dataset.
For this reason, when a new schema modification occurs (or a new function, etc) you can decide to run manually the migration against your current database or simply wipe it and rebuild from the newest docker image.

### Execute a script

The scripts expect the same context present when building the image. So if you run a script afterward you will probably have to pass some environment variables (mostly for the db connection) along.
