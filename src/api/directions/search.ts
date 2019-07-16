import {Context} from 'koa';
import {create_app} from '../../lib/app';
import * as  body from 'koa-bodyparser';
import {middleware as schema} from 'koa-json-schema';
import {Direction_search_query_body} from '../../lib/interfaces';
import * as direction_service from '@mapbox/mapbox-sdk/services/directions';
import conf from '../../conf/index';
import timer from '../../lib/middlewares/server-timing';

interface WayPoint {
    coordinates: [number, number];
}

interface MapboxRequestConfig {
    profile: 'cycling';
    waypoints: WayPoint[];
    alternatives?: boolean;
    steps?: boolean
}

interface MapboxRouteleg {
    distance: number;
    duration: number;
    summary: string;
}

interface MapboxWaypoint {
    name: string;
    distance: number;
    location: number;
}

interface MapboxRoute {
    duration: number;
    distance: number;
    geometry: string;
    legs: MapboxRouteleg[]
}

interface MapboxResponse {
    routes: MapboxRoute[];
    waypoints: MapboxWaypoint[];
}

const endpoint = async (ctx: Context) => {
    // @ts-ignore;
    const {waypoints}: Direction_search_query_body = ctx.request.body;

    const service = direction_service({
        accessToken: conf.mapbox.token
    });

    const mapbox_request_config: MapboxRequestConfig = {
        profile: 'cycling',
        alternatives: true,
        // steps: true,
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
