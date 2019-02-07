import * as Koa from 'koa';

export interface Endpoint {
    //todo
    (app: Koa, router: any): any
}
