import {Context} from 'koa';
import {createApp} from '../../utils/app';
import * as  body from 'koa-bodyparser';
import {middleware as schema} from 'koa-json-schema';
import * as GeoCoder from 'node-geocoder';

const endpoint = async (ctx: Context, next: Function) => {
    // @ts-ignore
    const {lat, lng} = ctx.request.body;

    const geocoding = GeoCoder({
        provider: 'openstreetmap'
    });

    const queryObject = {
        lat,
        lon: lng
    };

    ctx.body = await geocoding
        .reverse(queryObject);
};

const schemaDefinition = {
    type: 'object',
    properties: {
        lng: {
            type: 'number'
        },
        lat: {
            type: 'number'
        }
    },
    required: ['lng', 'lat']
};

export default createApp(app => {
    app.use(body());
    app.use(schema(schemaDefinition));
    app.use(endpoint);
});
