import {relative, resolve} from 'path';
import * as globby from 'globby';
import {createHarness, mochaTapLike, SpecFunction} from 'zora';
import * as dotenv from 'dotenv';
import conf from '../src/conf/index';
import {Pool} from 'pg';

const db_pool = new Pool(conf.db);

dotenv.config({
    path: './test/test.env'
});

export const harness = createHarness();
export const test = (description: string, func: SpecFunction) => harness.test(description, func);

(async () => {
    let error = null;
    try {

        console.log(await db_pool.query(`select now()`));


        const path = await globby('./test/{unit,int}/*.js');
        const absolutePath = path
            .map(relPath => resolve(process.cwd(), relPath));

        for (const file of absolutePath) {
            const {default: func} = require(file);
            test(relative(process.cwd(), file), func);
        }

        await harness.report(mochaTapLike);
    } catch (e) {
        error = e;
        console.error(e);
    } finally {
        process.exit((error || harness.pass === false) ? 1 : 0);
    }
})();
