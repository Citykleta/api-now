"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const now = require("../now.json");
const path_1 = require("path");
const { routes } = now;
const router = routes.map(r => {
    const handler1 = path_1.relative(__dirname, path_1.resolve(process.cwd(), r.dest)).replace('.ts', '.js');
    console.log(handler1);
    return Object.assign(r, { regexp: new RegExp(r.src), handler: require(handler1.replace(/\?(.)*$/, '')).default });
});
const handler = (req, res) => {
    const { url } = req;
    for (const { regexp, handler, dest } of router) {
        if (regexp.test(url)) {
            const [targetqs] = url.replace(regexp, dest).split('?').reverse();
            req.url = ['?', targetqs].join('');
            return handler(req, res);
        }
    }
    res.status = 404;
    res.end('Not Found');
};
http_1.createServer(handler).listen(3000);
