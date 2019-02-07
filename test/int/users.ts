import {createServer} from 'http';
import users from '../../src/api/users/app';
import * as request from 'supertest';
import {Assert} from 'zora';

export default (t: Assert) => {

    t.test('users users should return a json playload with a users of users', async t => {
        const server = createServer(users().callback()); //todo pass conf here
        const resp = await request(server)
            .get('/')
            .expect(200);
        t.eq(resp.body, [{
            id: 1,
            name: 'Laurent RENARD'
        }], 'should return a users of users');
        server.close();
    });

    t.test('users details should return a json playload with a given user details ', async t => {
        const server = createServer(users().callback());
        const resp = await request(server)
            .get('/laurent')
            .expect(200);
        t.eq(resp.body, {
            id: 'laurent',
            name: 'foooooo'
        }, 'should return laurent user details');
        server.close();
    });
}
