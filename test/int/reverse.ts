import {Assert} from 'zora';
import app from '../../src/api/locations/reverse';
import * as req from 'supertest';

const location_match = [{
    "address": {
        "municipality": "Plaza de la Revolución",
        "number": null,
        "street": null,
    },
    "category": "beauty",
    "description": null,
    "distance": 0,
    "geometry": {
        "coordinates": [
            -82.387798,
            23.114536
        ],
        "type": "Point"
    },
    "id": 169,
    "name": "Maritza",
    "type": "point_of_interest",
}, {
    "address": {
        "municipality": "Plaza de la Revolución",
        "number": null,
        "street": null,
    },
    "category": "hairdresser",
    "description": null,
    "distance": 34,
    "geometry": {
        "coordinates": [
            -82.387494,
            23.114523
        ],
        "type": "Point"
    },
    "id": 170,
    "name": "Ramses barbero",
    "type": "point_of_interest"
}, {
    "address": {
        "municipality": "Plaza de la Revolución",
        "number": null,
        "street": "Tulipán"
    },
    "category": "fast_food",
    "description": null,
    "distance": 42,
    "geometry": {
        "coordinates": [
            -82.388174,
            23.11452
        ],
        "type": "Point"
    },
    "id": 165,
    "name": "Cafetería Complacer",
    "type": "point_of_interest"
}];

export default (t: Assert) => {
    const {test} = t;

    test('should not process if the query does not have proper "lng" and "lat" props ', async t => {
        const res = await req(app)
            .get('/?lat=23.114536');

        t.eq(res.status, 422, 'request should not be processable');
    });

    test('should find matches ordered by distance', async t => {
        const res = await req(app)
            .get('/')
            .query({lng: -82.387798, lat: 23.114536});

        t.eq(res.status, 200);
        t.eq(res.body, location_match);
    });
};
