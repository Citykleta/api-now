import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';
import {Endpoint} from './interfaces';
import error from './middlewares/error';
// import {load} from 'conf-load';

// process.stdout
const defaultTransport = (str, args) => {
    console.log(...args);
};

// do not log
const muteTransport = () => {
};

const applicationLogger = logger(process.env.NODE_ENV === 'test' ? muteTransport : defaultTransport);

export const createApp = (endpoint: Endpoint) => {
    const app = new Koa();
    const router = new Router();
    app.use(applicationLogger);
    app.use(error());
    endpoint(app, router);
    app.use(router.routes());
    app.use(router.allowedMethods());
    return app;
};
