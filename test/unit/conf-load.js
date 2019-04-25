"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (t) => {
    t.test('should have loaded configuration env', t => {
        t.eq(process.env.NODE_ENV, 'test', 'node environment should be set to "test"');
    });
};
