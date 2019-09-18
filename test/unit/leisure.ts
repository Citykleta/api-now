import {Assert} from 'zora';
import leisure_app from '../../src/api/leisure/index';
import req from 'supertest';
import data from '../../src/api/leisure/data';

export default (t: Assert) => {
    t.test('forward valid query to mapbox with cycling profile', async t => {
        const res = await req(leisure_app)
            .get('/')
            .expect(200);

        t.eq(res.body, data, 'should find the hard coded data set');
    });
};
