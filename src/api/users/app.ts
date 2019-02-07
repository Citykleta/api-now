import {createApp} from '../../utils/app';
import listEndPoint from './list';
import detailsEndpoint from './details';
import {load} from 'conf-load';

export default (conf = load()) => createApp((app, router) => {
    router.get('/', listEndPoint);
    router.get('/:id', detailsEndpoint);
});
