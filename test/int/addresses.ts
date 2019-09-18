import {Assert} from 'zora';
import app from '../../src/api/addresses/index';
import req from 'supertest';


const generate_test_case = (t: Assert, expected: any) => (query: string) => t.test(`${query}`, async t => {
    const res = await req(app)
        .get('/')
        .query({search: query});

    t.eq(res.status, 200);
    t.eq(res.body, expected);
});

export default (t: Assert) => {
    const {test} = t;

    test('should not process if the search query is missing', async t => {
        const res = await req(app)
            .get('/');

        t.eq(res.status, 422, 'request should not be processable');
    });

    test('find a corner', t => {

        const corner_1_an_10 = [{
            'type': 'corner',
            'geometry': {'type': 'Point', 'coordinates': [-82.4069873, 23.1370449]},
            'streets': ['Calle 10', '1ra'],
            'municipality': 'Plaza de la Revolución'
        }];
        const one_and_ten_test_cases = [
            '1 y 10',
            '1ra avenida y calle 10',
            '1ra avenida esquina calle 10',
            '1ra avenida esq. a 10',
        ];

        const zanja_and_galiano = [{
            'type': 'corner',
            'geometry': {'type': 'Point', 'coordinates': [-82.3630087, 23.1342865]},
            'streets': ['Avenida de Italia (Galiano)', 'Zanja'],
            'municipality': 'Centro Habana'
        }];
        const zanja_and_galiano_test_cases = [
            'Zanja y Galiano',
            'zanja y avenida de italia'
        ];

        const expect_one_and_ten = generate_test_case(t, corner_1_an_10);
        const expect_zanja_and_galiano = generate_test_case(t, zanja_and_galiano);

        one_and_ten_test_cases.forEach(expect_one_and_ten);
        zanja_and_galiano_test_cases.forEach(expect_zanja_and_galiano);

        t.test('taking the municipio into consideration', async t => {
            const res = await req(app)
                .get('/')
                .query({search: 'Zanja y Galiano, plaza'});

            const res_bis = await req(app)
                .get('/')
                .query({search: 'Zanja y Galiano, centro'});

            t.eq(res.status, 200);
            t.eq(res_bis.status, 200);
            t.eq(res.body, []);
            t.eq(res_bis.body, zanja_and_galiano);
        });
    });

    t.test('find a block', t => {

        const ten_between_first_and_third = [{
            'type': 'street_block',
            'name': 'Calle 10',
            'municipality': 'Plaza de la Revolución',
            'geometry': {'type': 'LineString', 'coordinates': 'gxelCb~}uNgDpC'},
            'intersections': [{
                'type': 'corner',
                'geometry': {'type': 'Point', 'coordinates': [-82.4069873, 23.1370449]},
                'name': '1ra'
            }, {
                'type': 'corner',
                'geometry': {'type': 'Point', 'coordinates': [-82.4062574, 23.1362007]},
                'name': '3ra'
            }]
        }];
        const ten_between_first_and_third_test_cases = [
            '10 entre 1 y 3',
            'calle 10 e/ 1ra avenida y 3ra',
            'calle 10 #234, e/ 1 y 3',
            '10 No. 234 e/1 y 3'
        ];
        const san_miguel_between_lealtad_and_escobar = [
            {
                'geometry': {
                    'coordinates': '{|elCbhvuNBpC',
                    'type': 'LineString'
                },
                'intersections': [
                    {
                        'geometry': {
                            'coordinates': [
                                -82.3669018,
                                23.1369447
                            ],
                            'type': 'Point'
                        },
                        'name': 'Lealtad',
                        'type': 'corner'
                    },
                    {
                        'geometry': {
                            'coordinates': [
                                -82.3676274,
                                23.1369151
                            ],
                            'type': 'Point'
                        },
                        'name': 'Escobar',
                        'type': 'corner'
                    }
                ],
                'municipality': 'Centro Habana',
                'name': 'San Miguel',
                'type': 'street_block'
            }
        ];
        const san_miguel_between_lealtad_and_escobar_test_cases = [
            'San Miguel e/ Lealtad y Escobar',
            'miguel entre calle Lealtad y calle escobar',
            'calle san miguel #12334 e/lealtad y escobar'
        ];

        const expect_ten_between_first_and_third = generate_test_case(t, ten_between_first_and_third);
        const expect_san_miguel_between_lealtad_and_escobar = generate_test_case(t, san_miguel_between_lealtad_and_escobar);

        ten_between_first_and_third_test_cases.forEach(expect_ten_between_first_and_third);
        san_miguel_between_lealtad_and_escobar_test_cases.forEach(expect_san_miguel_between_lealtad_and_escobar);

        t.test('taking the municipio into consideration', async t => {
            const res = await req(app)
                .get('/')
                .query({search: 'San Miguel e/ Lealtad y Escobar,plaza'});

            const res_bis = await req(app)
                .get('/')
                .query({search: 'San Miguel e/ Lealtad y Escobar, centro'});

            t.eq(res.status, 200);
            t.eq(res_bis.status, 200);
            t.eq(res.body, []);
            t.eq(res_bis.body, san_miguel_between_lealtad_and_escobar);
        });
    });
};
