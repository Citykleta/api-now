import {createServer} from 'http';
import * as now from '../now.json';
import {relative, resolve} from 'path';

const {routes} = now;
const router = routes.map(r => {
    const handler1 = relative(__dirname, resolve(process.cwd(), r.dest)).replace('.ts', '.js');
    console.log(handler1);
    return Object.assign(r, {regexp: new RegExp(r.src), handler: require(handler1.replace(/\?(.)*$/, '')).default});
});

const handler = (req, res) => {
    const {url} = req;
    for (const {regexp, handler, dest} of router) {
        if (regexp.test(url)) {
            const [targetqs] = url.replace(regexp, dest).split('?').reverse();
            req.url = ['?', targetqs].join('');
            return handler(req, res);
        }
    }
    res.status = 404;
    res.end('Not Found');
};

createServer(handler).listen(3000);
