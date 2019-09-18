"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const globby_1 = __importDefault(require("globby"));
const zora_1 = require("zora");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: './test/test.env'
});
exports.harness = zora_1.createHarness();
exports.test = (description, func) => exports.harness.test(description, func);
(async () => {
    let error = null;
    try {
        const path = await globby_1.default('./test/{unit,int}/*.js');
        const absolutePath = path
            .map(relPath => path_1.resolve(process.cwd(), relPath));
        for (const file of absolutePath) {
            const { default: func } = require(file);
            exports.test(path_1.relative(process.cwd(), file), func);
        }
        await exports.harness.report(zora_1.mochaTapLike);
    }
    catch (e) {
        error = e;
        console.error(e);
    }
    finally {
        process.exit((error || exports.harness.pass === false) ? 1 : 0);
    }
})();
