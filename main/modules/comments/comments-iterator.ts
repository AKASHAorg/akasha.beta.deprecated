import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import fetchComment from './get-comment';

const commentsIterator = {
    'id': '/commentsIterator',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'entryId': { 'type': 'string' },
        'toBlock': { 'type': 'number' },
        'parent': { 'type': 'string' },
        'author': { 'type': 'string', 'format': 'address' }
    },
    'required': ['entryId', 'toBlock']
};

/**
 * Get entries indexed by tag
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: {
    toBlock: number,
    limit?: number, entryId?: string, parent?: string, author?: string, lastIndex?: number
}) {

    const v = new schema.Validator();
    v.validate(data, commentsIterator, { throwError: true });

    const collection = [];
    const maxResults = data.limit || 5;
    const fetched = yield contracts
        .fromEvent(contracts.instance.Comments.Publish, {
                entryId: data.entryId,
                parent: data.parent,
                author: data.author
            },
            data.toBlock, maxResults, { lastIndex: data.lastIndex });
    for (let event of fetched.results) {
        const comment = yield fetchComment.execute({
            commentId: event.args.id,
            entryId: event.args.entryId,
            noResolve: true
        });
        collection.push(Object.assign({}, comment, { commentId: event.args.id }));
    }

    return { collection: collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
});

export default { execute, name: 'commentsIterator' };

