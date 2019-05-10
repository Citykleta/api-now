import {Assert} from 'zora';
import searchApp from '../../src/api/directions/search';
import * as req from 'supertest';
import * as nock from 'nock';
import conf from '../../src/conf/index';

export default (t: Assert) => {
    // todo move to integration tests
    // t.test('invalid waypoints, it needs at least two points', async t => {
    //     const res = await req(searchApp)
    //         .post('/')
    //         .send({
    //             waypoints: [{
    //                 lng: 1234,
    //                 lat: 23445
    //             }]
    //         })
    //         .expect(422);
    // });

    t.test('forward valid query to mapbox with cycling profile', async t => {
        const expected = {
            'routes': [{
                'geometry': 'y_dlC|q_vNf@t@oDbDaNbLwB}CrDaD',
                'legs': [{'summary': '', 'weight': 220.3, 'duration': 214, 'steps': [], 'distance': 742.9}],
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
                {'distance': 16.641963736907044, 'name': 'Calle 4', 'location': [-82.416135, 23.129964]}],
            'code': 'Ok',
            'uuid': 'cjs1wlink00qi42pawtwxhcyi'
        };
        const mapbox = nock(`https://api.mapbox.com`, {encodedQueryParams: true})
            .get('/directions/v5/mapbox/cycling/-82.41457%2C23.12719%3B-82.41601%2C23.13006')
            .query({
                'radiuses': 'unlimited%3Bunlimited',
                'access_token': conf.mapbox.token
            })
            .reply(200, expected);

        const res = await req(searchApp)
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

    t.test('return 503 when map box returns an error', async t => {
        const mapbox = nock(`https://api.mapbox.com`, {encodedQueryParams: true})
            .get('/directions/v5/mapbox/cycling/-82.41457%2C23.12719%3B-82.41601%2C23.13006')
            .query({
                'radiuses': 'unlimited%3Bunlimited',
                'access_token': conf.mapbox.token
            })
            .reply(500);

        const res = await req(searchApp)
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
