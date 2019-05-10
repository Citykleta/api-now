import {Assert} from 'zora';
import {handler as search_location_handler} from '../../src/api/locations/handlers/search';
import * as req from 'supertest';
import * as Koa from 'koa';

const createApp = db => {
    const app = new Koa();
    app.use(search_location_handler(db));
    return app.callback();
};

const create_db_stub = (rows) => {

    const calls = [];
    let return_value = null;

    return {
        async query(...args) {
            calls.push(...args);
            return {rows};
        },
        calls
    };
};

export default (t: Assert) => {
    t.test('search points of interest: when passed a simple query should return a list of poi', async t => {
        // EXPECTED
        const expected = [{
            id: 1,
            name: 'some place',
            category: 'restaurant',
            geometry: {
                type: 'Point',
                coordinates: [-82.343434, 23.343434]
            },
            description: 'a very nice place'
        }, {
            id: 666,
            name: 'some other place',
            category: 'bar',
            geometry: {
                type: 'Point',
                coordinates: [-82.010101, 23.010101]
            },
            description: 'another very nice place'
        }];

        // GIVEN
        const db = create_db_stub(expected);
        const res = await req(createApp(db))
            .get('/?query=foo')
            .expect(200);

        // EXPECT
        t.eq(db.calls.length, 1);
        t.eq(res.body, expected);
        t.eq(db.calls[0], `
SELECT 
    poi_id as id, 
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    json_build_object('number',"addr:number",'street',"addr:street", 'municipality', "addr:municipality") as address,
    description
FROM find_suggestions('foo:*') 
JOIN points_of_interest USING(poi_id);`);
    });

    t.test('search points of interest: when a multi words query is passed we should match all of them', async t => {
        // EXPECTED
        const expected = [{
            id: 1,
            name: 'some place',
            category: 'restaurant',
            geometry: {
                type: 'Point',
                coordinates: [-82.343434, 23.343434]
            },
            description: 'a very nice place'
        }, {
            id: 666,
            name: 'some other place',
            category: 'bar',
            geometry: {
                type: 'Point',
                coordinates: [-82.010101, 23.010101]
            },
            description: 'another very nice place'
        }];

        // GIVEN
        const db = create_db_stub(expected);
        const res = await req(createApp(db))
            .get('/?query=foo+bar')
            .expect(200);

        // EXPECT
        t.eq(db.calls.length, 1);
        t.eq(res.body, expected);
        t.eq(db.calls[0], `
SELECT 
    poi_id as id, 
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    json_build_object('number',"addr:number",'street',"addr:street", 'municipality', "addr:municipality") as address,
    description
FROM find_suggestions('bar:* & foo') 
JOIN points_of_interest USING(poi_id);`);
    });
};
