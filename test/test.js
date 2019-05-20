"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_address_1 = require("../src/lib/normalize_address");
const restaurant_1 = require("./fixture/restaurant");
const test_values = restaurant_1.restaurants.slice(0, 10);
for (const r of test_values) {
    console.log(r.address);
    try {
        console.log(JSON.stringify(normalize_address_1.create_address(r.address)));
    }
    catch (e) {
        console.log(e);
    }
}
