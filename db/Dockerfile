FROM postgres:10

ENV POSTGIS_MAJOR 2.5
ENV POSTGIS_VERSION 2.5.2+dfsg-1~exp1.pgdg90+1

# Deps
RUN apt-get update && apt-get install -y --fix-missing \
make \
cmake \
g++ \
libboost-dev \
libboost-system-dev \
libboost-filesystem-dev \
libexpat1-dev \
zlib1g-dev \
libbz2-dev \
libpq-dev \
libproj-dev \
lua5.2 \
liblua5.2-dev \
git-core \
postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR=$POSTGIS_VERSION \
postgresql-$PG_MAJOR-postgis-$POSTGIS_MAJOR-scripts=$POSTGIS_VERSION \
postgis=$POSTGIS_VERSION \
&& rm -rf /var/lib/apt/lists/*

# build osm2pgsql
RUN cd /tmp \
&& git clone https://github.com/openstreetmap/osm2pgsql.git \
&& mkdir -p osm2pgsql/build \
&& cd osm2pgsql/build \
&& cmake .. \
&& make install

# copy dictionaries in the tsearch
COPY ./dictionaries/ /usr/share/postgresql/10/tsearch_data/

# create the initidb folder to add db initialization scripts
RUN mkdir -p /docker-entrypoint-initdb.d /functions /schema /osm-data /import
COPY ./functions/*.sql /functions/
COPY ./schema/*.sql /schema/
COPY osm-data/*.sql /import/

# add setup script
COPY scripts/1_create_extensions /usr/local/bin/create_extensions
COPY scripts/2_create_schema /usr/local/bin/create_schema
COPY scripts/3_create_functions /usr/local/bin/create_functions
COPY scripts/4_import_data /usr/local/bin/import_data
COPY scripts/entrypoint /docker-entrypoint-initdb.d/entrypoint.sh

VOLUME /osm-data
