import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const commentsCount = {
    'id': '/commentsCount',
    'type': 'array',
    'items': {
        'type': 'string'
    },
    'uniqueItems': true,
    'minItems': 1
};
/**
 * Get total number of comments for an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: string[]) {
    const v = new schema.Validator();
    v.validate(data, commentsCount, { throwError: true });
    const collection = [];

    for (let entryId of data) {
        const count = yield contracts.instance.Comments.totalComments(entryId);
        collection.push({ count: count.toNumber(), entryId });
    }

    return { collection };
});

export default { execute, name: 'commentsCount' };
