BEGIN;

DROP TABLE IF EXISTS municipalities CASCADE;

CREATE TABLE municipalities(
    name varchar(256),
    geometry geometry(Polygon,4326),
    vector tsvector,
    osm_id bigint not null, -- for debug purpose
    PRIMARY KEY(name)
);

CREATE INDEX municipalities_vector_idx ON municipalities USING GIN (vector);
CREATE INDEX municipalities_geometry_idx ON municipalities USING GIST (geometry);
--CREATE INDEX municipalities_name_idx ON municipalities USING GIST (name gist_trgm_ops);

COMMIT;
