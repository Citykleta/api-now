import {resolve, relative} from 'path';
import * as globby from 'globby';
import {createHarness, SpecFunction, mochaTapLike} from 'zora';

export const harness = createHarness();
export const test = (description: string, func: SpecFunction) => harness.test(description, func);

(async () => {
    let error = null;
    try {
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
