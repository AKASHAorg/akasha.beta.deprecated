import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const getTagEntriesCount = {
    'id': '/getTagEntriesCount',
    'type': 'array',
    'items': {
        'type': 'string'
    },
    'uniqueItems': true,
    'minItems': 1
};
/**
 * Get total number of entries posted by profile
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntriesCountTagRequest []) {
    const v = new schema.Validator();
    v.validate(data, getTagEntriesCount, { throwError: true });

    const requests = data.map((tag) => {
        return contracts.instance.Tags
            .totalEntries(tag)
            .then((count) => {
                return { count: count.toString(10), tag: tag };
            });
    });
    const collection = yield Promise.all(requests);
    return { collection };
});

export default { execute, name: 'getTagEntriesCount' };
