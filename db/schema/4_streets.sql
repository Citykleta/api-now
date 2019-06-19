BEGIN;

DROP TABLE IF EXISTS streets CASCADE;

CREATE TABLE streets(
    street_id serial PRIMARY KEY,
    name varchar(256),
    osm_id bigint,
    category VARCHAR(128),
    geometry geometry(LineString,4326),
    vector tsvector
);

CREATE INDEX streets_vector_idx ON streets USING GIN (vector);
CREATE INDEX streets_geometry_idx ON streets USING GIST (geometry);
CREATE INDEX streets_name_idx ON streets USING GIST (name gist_trgm_ops);

COMMIT;
