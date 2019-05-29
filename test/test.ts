import {create_address} from '../src/lib/normalize_address';
import {restaurants} from './fixture/restaurant';

const test_values = restaurants.slice(0, 10);

for (const r of test_values) {
    console.log(r.address);
    try {
        console.log(JSON.stringify(create_address(r.address)));
    } catch (e) {
        console.log(e);
    }
}
