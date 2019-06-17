BEGIN;

DROP TABLE IF EXISTS points_of_interest CASCADE;

CREATE TABLE points_of_interest(
    poi_id serial PRIMARY KEY,
    name varchar(256),
    category VARCHAR(128),
    geometry geometry(POINT,4326),
    vector tsvector,
    house_number varchar(64),
    street_name varchar(256),
    municipality_name varchar(128),
    description text,
    osm_id bigint not null, --for debug purpose
    foreign key(municipality_name) references municipalities(name)
);

CREATE INDEX poi_vector_idx ON points_of_interest USING GIN (vector);
CREATE INDEX poi_geometry_idx ON points_of_interest USING GIST (geometry);
CREATE INDEX poi_name_idx ON points_of_interest USING GIST (name gist_trgm_ops);

COMMIT;
