import * as Promise from 'bluebird';
import contracts from '../../contracts/index';


/**
 * Get Tags from Created event
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: GenericFromEventRequest) {
    const event = yield contracts.instance.Tags.TagCreate(data);
    const collection = yield event.get();
    return { collection };
});

export default { execute, name: 'getTagsCreated' };
