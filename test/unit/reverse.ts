import {Assert} from 'zora';
import {handler as reverse_search_handler} from '../../src/api/locations/handlers/reverse';
import * as req from 'supertest';
import * as Koa from 'koa';

const createApp = db => {
    const app = new Koa();
    app.use(reverse_search_handler(db));
    return app.callback();
};

const create_db_stub = (rows) => {

    const calls = [];
    let return_value = null;

    return {
        async query(...args) {
            calls.push([...args]);
            return {rows};
        },
        calls
    };
};

export default (t: Assert) => {
    t.test('reverse search should request the nearest points of interest', async t => {
        // EXPECTED
        const expected = [{
            id: 1,
            name: 'some place',
            category: 'restaurant',
            geometry: {
                type: 'Point',
                coordinates: [-82.343434, 23.343434]
            },
            description: 'a very nice place',
            distance:10
        }, {
            id: 666,
            name: 'some other place',
            category: 'bar',
            geometry: {
                type: 'Point',
                coordinates: [-82.010101, 23.010101]
            },
            description: 'another very nice place',
            distance: 15
        }];

        // GIVEN
        const db = create_db_stub(expected);
        const res = await req(createApp(db))
            .get('/?lng=-82.4038&lat=23.1388')
            .expect(200);

        // EXPECT
        t.eq(db.calls.length, 1);
        t.eq(res.body, expected);
        t.eq(db.calls[0][0], `
SELECT 
    poi_id as id,
    'point_of_interest' as type,
    name,
    category,
    ST_AsGeoJSON(geometry, 6)::json as geometry,
    json_build_object('number', house_number, 'street', street_name, 'municipality', municipality_name) as address,
    description,
    distance
FROM find_suggestions_closed_to($1, $2) JOIN points_of_interest USING(poi_id)
ORDER BY distance
LIMIT 5
;`, 'query should match');
        t.eq(db.calls[0][1], ['-82.4038','23.1388'], 'arguments should match lng lat');
    });
};
