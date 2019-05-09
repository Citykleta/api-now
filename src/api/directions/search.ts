import {Context} from 'koa';
import {create_app} from '../../utils/app';
import * as  body from 'koa-bodyparser';
import {middleware as schema} from 'koa-json-schema';
import {Direction_search_query_body} from '../../utils/interfaces';
import * as direction_service from '@mapbox/mapbox-sdk/services/directions';
import conf from '../../conf/index';
import timer from '../../utils/middlewares/server-timing';

interface WayPoint {
    coordinates: [number, number];
    radius: 'unlimited';
}

interface MapboxRequestConfig {
    profile: 'cycling';
    waypoints: WayPoint[];
}

const endpoint = async (ctx: Context) => {
    // @ts-ignore;
    const {waypoints}: Direction_search_query_body = ctx.request.body;

    const service = direction_service({
        accessToken: conf.mapbox.token
    });

    const mapbox_request_config: MapboxRequestConfig = {
        profile: 'cycling',
        // steps: true,
        // @ts-ignore
        waypoints: waypoints.map(({lng, lat}: { lng: number, lat: number }) => ({
            coordinates: [lng, lat],
            radius: 'unlimited'
        }))
    };

    try {
        const response = await service
            .getDirections(mapbox_request_config)
            .send();
        ctx.body = response.body;
    } catch (e) {
        ctx.throw(503);
    }

};

const schema_definition = {
    type: 'object',
    properties: {
        waypoints: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    lng: {
                        type: 'number',
                    },
                    lat: {
                        type: 'number'
                    }
                },
                required: ['lng', 'lat']
            },
            minItems: 2
        }
    },
    required: ['waypoints']
};

export default create_app(app => {
    app.use(body());
    app.use(schema(schema_definition));
    app.use(timer());
    app.use(endpoint);
});
