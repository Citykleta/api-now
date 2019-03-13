import {Context} from 'koa';
import {createApp} from '../../utils/app';
import * as  body from 'koa-bodyparser';
import {middleware as schema} from 'koa-json-schema';
import {LocationSearchQueryBody} from '../../utils/interfaces';
import * as GeoCoder from 'node-geocoder';
import {HAVANA_BOUNDING_BOX} from '../../utils/constants';

interface NodeGeocoderOutput {
    latitude: number;
    longitude: number;
    formattedAddress: string;
    country: string;
    state: string;
    zipcode: string;
    streetName: string;
    streetNumber: string;
    countryCode: string;
    neighbourhood: string;
    provider: string;
}

export interface Address {
    number?: string;
    street?: string;
    municipality: string;
}

export interface GeoLocation {
    lng: number;
    lat: number;
    osm_id?: number;
    name?: string;
    address?: Address;
    category?: string; // todo use an enum (restaurant, cafe, etc)
}

const format = (input: NodeGeocoderOutput[]): GeoLocation[] =>
    input
        .filter(i => i.country === 'Cuba' && i.state === 'La Habana')
        .map(i => {
            const parts = i.formattedAddress.split(',');

            const address = {
                number: i.streetNumber,
                street: i.streetName
                //todo municipality
            };

            return {
                name: parts[0] || address.street || '',
                lat: i.latitude,
                lng: i.longitude
            };
        });

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
        dedupe: true
    };

    const response = await geocoding.geocode(queryObject);
    ctx.body = format(response);
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
