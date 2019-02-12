import {Context} from 'koa';
import {createApp} from '../../utils/app';
import * as  body from 'koa-bodyparser';
import {middleware as schema} from 'koa-json-schema';
import {LocationSearchQueryBody} from '../../utils/interfaces';
import {HAVANA_BOUNDING_BOX} from '../../utils/constants';
import * as mapboxSearch from '@mapbox/mapbox-sdk/services/geocoding';
import conf from '../../conf/index';

const endpoint = async (ctx: Context, next: Function) => {
    // @ts-ignore
    const {query, proximity}: LocationSearchQueryBody = ctx.request.body;

    const geocoding = mapboxSearch({
        accessToken: conf.mapbox.token
    });

    const mapboxConfigObject = {
        query: query,
        bbox: HAVANA_BOUNDING_BOX,
        language: ['es', 'en']
    };

    if (proximity) {
        //@ts-ignore
        mapboxConfigObject.proximity = [proximity.ln, proximity.lat];
    }

    const response = await geocoding
        .forwardGeocode(mapboxConfigObject)
        .send();

    ctx.body = response.body;
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
