import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const getTagsCreated = {
    'id': '/getTagsCreated',
    'type': 'object',
    'properties': {
        'fromBlock': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
    },
    'required': ['fromBlock', 'toBlock']
};


/**
 * Get Tags from Created event
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: GenericFromEventRequest) {
    const v = new schema.Validator();
    v.validate(data, getTagsCreated, { throwError: true });

    const event = yield contracts.instance.Tags.TagCreate(data);
    const collection = yield event.get();
    return { collection };
});

export default { execute, name: 'getTagsCreated' };
