import {Context} from 'koa';
import {createApp} from '../../utils/app';
import * as  body from 'koa-bodyparser';
import {middleware as schema} from 'koa-json-schema';
import {DirectionSearchQueryBody} from '../../utils/interfaces';
import * as directionService from '@mapbox/mapbox-sdk/services/directions';
import conf from '../../conf/index';

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
    const {waypoints}: DirectionSearchQueryBody = ctx.request.body;

    const service = directionService({
        accessToken: conf.mapbox.token
    });

    const mapboxConfigObject: MapboxRequestConfig = {
        profile: 'cycling',
        // steps: true,
        // @ts-ignore
        waypoints: waypoints.map(({lng, lat}: { lng: number, lat: number }) => ({
            coordinates: [lng, lat],
            radius: 'unlimited'
        }))
    };

    const response = await service
        .getDirections(mapboxConfigObject)
        .send();

    ctx.body = response.body;
};

const schemaDefinition = {
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

export default createApp(app => {
    app.use(body());
    app.use(schema(schemaDefinition));
    app.use(endpoint);
});
