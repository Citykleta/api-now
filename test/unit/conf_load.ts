import {Assert} from 'zora';

export default (t: Assert) => {
    t.test('should have loaded configuration env', t => {
        t.eq(process.env.NODE_ENV, 'test', 'node environment should be set to "test"');
        t.eq(process.env.POSTGRES_DB, 'test', 'database env  should have been loaded');
        t.eq(process.env.POSTGRES_USER, 'tester', 'database env should have been loaded');
    });
}
