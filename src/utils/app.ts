import * as Koa from 'koa';
import * as logger from 'koa-logger';
import {Endpoint} from './interfaces';
import error from './middlewares/error';
import * as cors from '@koa/cors';
import conf from '../conf/index';


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
    app.use(cors(conf.cors));
    endpoint(app);
    return app.callback();
};
