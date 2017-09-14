import * as Promise from 'bluebird';
import contracts from '../../contracts/index';


/**
 * Get Tags from Created event
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: GenericFromEventRequest) {
    const collection = yield contracts.instance.tags.getTagsCreated(data);
    return { collection };
});

export default { execute, name: 'getTagsCreated' };
