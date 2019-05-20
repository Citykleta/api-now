import {Assert} from 'zora';

export default (t: Assert) => {
    t.test('should have loaded configuration env', t => {
        t.eq(process.env.NODE_ENV, 'test', 'node environment should be set to "test"');
    });
}
