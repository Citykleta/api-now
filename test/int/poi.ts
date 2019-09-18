import {Assert} from 'zora';
import app from '../../src/api/locations/poi';
import req from 'supertest';

const maritza_matches = [{
    'id': 169,
    'type': 'point_of_interest',
    'name': 'Maritza',
    'category': 'beauty',
    'geometry': {'type': 'Point', 'coordinates': [-82.387798, 23.114536]},
    'address': {'number': null, 'street': null, 'municipality': 'Plaza de la Revolución'},
    'description': null
}, {
    'id': 961,
    'type': 'point_of_interest',
    'name': 'Hostal Guillén & Maritza 2',
    'category': 'guest_house',
    'geometry': {'type': 'Point', 'coordinates': [-82.403806, 23.138894]},
    'address': {'number': '426', 'street': 'Calle 3', 'municipality': 'Plaza de la Revolución'},
    'description': null
}, {
    'id': 980,
    'type': 'point_of_interest',
    'name': 'Hostal Guillén & Maritza',
    'category': 'guest_house',
    'geometry': {'type': 'Point', 'coordinates': [-82.400761, 23.138118]},
    'address': {'number': '126', 'street': 'Paseo', 'municipality': 'Plaza de la Revolución'},
    'description': null
}, {
    'id': 2020,
    'type': 'point_of_interest',
    'name': 'Casa Maritza',
    'category': 'guest_house',
    'geometry': {'type': 'Point', 'coordinates': [-82.389617, 23.140909]},
    'address': {'number': '306', 'street': 'Calle 15 entre H e I', 'municipality': 'Plaza de la Revolución'},
    'description': null
}, {
    'id': 2631,
    'type': 'point_of_interest',
    'name': 'MARITZA HOME',
    'category': 'guest_house',
    'geometry': {'type': 'Point', 'coordinates': [-82.383523, 23.144216]},
    'address': {'number': '1001', 'street': 'Calle 17', 'municipality': 'Plaza de la Revolución'},
    'description': null
}];
const pescaderia_matches = [{
    'id': 238,
    'type': 'point_of_interest',
    'name': 'Pescadería Mercomar',
    'category': 'seafood',
    'geometry': {'type': 'Point', 'coordinates': [-82.401335, 23.115412]},
    'address': {'number': null, 'street': '30', 'municipality': 'Plaza de la Revolución'},
    'description': null
}, {
    'id': 779,
    'type': 'point_of_interest',
    'name': 'Pescadería',
    'category': 'seafood',
    'geometry': {'type': 'Point', 'coordinates': [-82.397753, 23.131703]},
    'address': {'number': null, 'street': null, 'municipality': 'Plaza de la Revolución'},
    'description': null
}, {
    'id': 1270,
    'type': 'point_of_interest',
    'name': 'Pescadería Mercomar',
    'category': 'seafood',
    'geometry': {'type': 'Point', 'coordinates': [-82.385083, 23.116295]},
    'address': {'number': null, 'street': 'Ayestarán y Calle Segunda', 'municipality': 'Plaza de la Revolución'},
    'description': null
}];
const fabrica_de_arte_matches = [{
    'id': 548,
    'type': 'point_of_interest',
    'name': 'Fábrica de Arte Cubano',
    'category': 'nightclub',
    'geometry': {'type': 'Point', 'coordinates': [-82.410017, 23.127506]},
    'address': {'number': null, 'street': 'Calle 26', 'municipality': 'Plaza de la Revolución'},
    'description': null
}, {
    'id': 357,
    'type': 'point_of_interest',
    'name': 'Casa de Jorge y Tatiana',
    'category': 'guest_house',
    'geometry': {'type': 'Point', 'coordinates': [-82.408034, 23.124007]},
    'address': {'number': '1412', 'street': 'Calle 19, entre 26 y 28', 'municipality': 'Plaza de la Revolución'},
    'description': 'Casa de los años 30 del siglo XX. Barrio tranquilo. Entrañables dueños, jubilados con una interesante conversación. Te ayudan en lo que pueden. Recomendable. Muy cerca de la Fábrica de Arte Cubano'
}];


export default (t: Assert) => {
    const {test} = t;

    test('should not process if the search query is missing', async t => {
        const res = await req(app)
            .get('/');

        t.eq(res.status, 422, 'request should not be processable');
    });

    test('should find exact match', async t => {
        const res = await req(app)
            .get('/')
            .query({search: 'Maritza'});

        t.eq(res.status, 200);
        t.eq(res.body, maritza_matches);
    });

    test('should find matches independently of the case', async t => {
        const res = await req(app)
            .get('/')
            .query({search: 'maritza'});

        t.eq(res.status, 200);
        t.eq(res.body, maritza_matches);
    });

    test('should find matches independently of the accents', async t => {
        const res = await req(app)
            .get('/')
            .query({search: 'pescadería'});

        const res_bis = await req(app)
            .get('/')
            .query({search: 'pescaderia'});

        t.eq(res.status, 200);
        t.eq(res_bis.status, 200);
        t.eq(res.body, pescaderia_matches);
        t.eq(res_bis.body, pescaderia_matches);
    });

    test('should find matches with several tokens', async t => {
        const res = await req(app)
            .get('/')
            .query({search: 'fabrica de arte cubano'});

        t.eq(res.status, 200);
        t.eq(res.body, fabrica_de_arte_matches);
    });

    test('should discard non relevant words', async t => {
        const res = await req(app)
            .get('/')
            .query({search: 'fabrica arte cubano'});

        t.eq(res.status, 200);
        t.eq(res.body, fabrica_de_arte_matches);
    });
};
