"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const poi_1 = require("../../src/api/locations/handlers/poi");
const supertest_1 = __importDefault(require("supertest"));
const koa_1 = __importDefault(require("koa"));
const createApp = db => {
    const app = new koa_1.default();
    app.use(poi_1.handler(db));
    return app.callback();
};
const create_db_stub = (rows) => {
    const calls = [];
    let return_value = null;
    return {
        async query(...args) {
            calls.push([...args]);
            return { rows };
        },
        calls
    };
};
exports.default = (t) => {
    t.test('search points of interest: when passed a simple query should return a list of poi', async (t) => {
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
        const res = await supertest_1.default(createApp(db))
            .get('/?search=foo')
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
    description
FROM find_suggestions($1) 
JOIN points_of_interest USING(poi_id)
LIMIT 5
;`, 'query should match');
        t.eq(db.calls[0][1], ['foo:*'], 'arguments should match');
    });
    t.test('search points of interest: when a multi words query is passed we should match all of them', async (t) => {
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
        const res = await supertest_1.default(createApp(db))
            .get('/?search=foo+bar')
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
    description
FROM find_suggestions($1) 
JOIN points_of_interest USING(poi_id)
LIMIT 5
;`, 'query should match');
        t.eq(db.calls[0][1], ['bar:* & foo'], 'arguments should match');
    });
};
