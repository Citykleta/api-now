import * as Koa from 'koa';
import * as logger from 'koa-logger';
import {Endpoint} from './interfaces';
import error from './middlewares/error';

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
    app.use(applicationLogger);
    app.use(error());
    endpoint(app);
    return app.callback();
};
