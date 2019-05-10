import * as Koa from 'koa';
import * as logger from 'koa-logger';
import {Endpoint} from './interfaces';
import error from './middlewares/error';
import * as cors from '@koa/cors';
import conf from '../conf/index';

// process.stdout
const default_transport = (str, args) => {
    console.log(...args);
};

// do not log
const mute_transport = () => {
};

const application_logger = logger(process.env.NODE_ENV === 'test' ? mute_transport : default_transport);

export const create_app = (endpoint: Endpoint) => {
    const app = new Koa();
    app.use(application_logger);
    app.use(error());
    app.use(cors(conf.cors));
    endpoint(app);
    return app.callback();
};
