import {Context} from 'koa';
import {createApp} from '../../utils/app';
import * as  body from 'koa-bodyparser';
import {middleware as schema} from 'koa-json-schema';
import {LocationSearchQueryBody} from '../../utils/interfaces';
import * as GeoCoder from 'node-geocoder';
import {HAVANA_BOUNDING_BOX} from '../../utils/constants';

const endpoint = async (ctx: Context, next: Function) => {
    // @ts-ignore
    const {query, proximity}: LocationSearchQueryBody = ctx.request.body;

    const geocoding = GeoCoder({
        provider: 'openstreetmap'
    });

    const queryObject = {
        city: 'La Habana',
        state: 'La Habana',
        country: 'Cuba',
        countrycodes: 'cu',
        viewbox: HAVANA_BOUNDING_BOX.join(','),
        q: query,
        dedupe:true
    };

    ctx.body = await geocoding
        .geocode(queryObject);
};

const schemaDefinition = {
    type: 'object',
    properties: {
        query: {
            type: 'string'
        },
        proximity: {
            type: 'object',
            properties: {
                ln: {
                    type: 'number',
                },
                lat: {
                    type: 'number'
                }
            },
            required: ['ln', 'lat']
        }
    },
    required: ['query']
};

export default createApp(app => {
    app.use(body());
    app.use(schema(schemaDefinition));
    app.use(endpoint);
});
