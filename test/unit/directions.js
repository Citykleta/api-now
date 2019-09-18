"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = __importDefault(require("../../src/api/directions/search"));
const supertest_1 = __importDefault(require("supertest"));
const nock_1 = __importDefault(require("nock"));
const index_1 = __importDefault(require("../../src/conf/index"));
exports.default = (t) => {
    t.test('forward valid query to mapbox with cycling profile', async (t) => {
        const expected = {
            'routes': [{
                    'geometry': 'y_dlC|q_vNf@t@oDbDaNbLwB}CrDaD',
                    'legs': [{ 'summary': '', 'weight': 220.3, 'duration': 214, 'steps': [], 'distance': 742.9 }],
                    'weight_name': 'cyclability',
                    'weight': 220.3,
                    'duration': 214,
                    'distance': 742.9
                }],
            'waypoints': [{
                    'distance': 2.731163366513253,
                    'name': '',
                    'location': [-82.414553, 23.127171]
                },
                { 'distance': 16.641963736907044, 'name': 'Calle 4', 'location': [-82.416135, 23.129964] }],
            'code': 'Ok',
            'uuid': 'cjs1wlink00qi42pawtwxhcyi'
        };
        const mapbox = nock_1.default(`https://api.mapbox.com`, { encodedQueryParams: true })
            .get('/directions/v5/mapbox/cycling/-82.41457%2C23.12719%3B-82.41601%2C23.13006')
            .query({
            radiuses: 'unlimited%3Bunlimited',
            alternatives: true,
            access_token: index_1.default.mapbox.token
        })
            .reply(200, expected);
        const res = await supertest_1.default(search_1.default)
            .post('/')
            .send({
            waypoints: [{
                    lng: -82.41457,
                    lat: 23.12719
                }, {
                    lng: -82.41601,
                    lat: 23.13006
                }]
        })
            .expect(200);
        t.eq(res.body, expected, 'should have forwarded the response body');
        t.ok(mapbox.isDone(), 'mapbox should have been called');
    });
    t.test('return 503 when map box returns an error', async (t) => {
        const mapbox = nock_1.default(`https://api.mapbox.com`, { encodedQueryParams: true })
            .get('/directions/v5/mapbox/cycling/-82.41457%2C23.12719%3B-82.41601%2C23.13006')
            .query({
            radiuses: 'unlimited%3Bunlimited',
            access_token: index_1.default.mapbox.token,
            alternatives: true
        })
            .reply(500);
        const res = await supertest_1.default(search_1.default)
            .post('/')
            .send({
            waypoints: [{
                    lng: -82.41457,
                    lat: 23.12719
                }, {
                    lng: -82.41601,
                    lat: 23.13006
                }]
        })
            .expect(503);
        t.ok(mapbox.isDone(), 'mapbox should have been called');
    });
};
