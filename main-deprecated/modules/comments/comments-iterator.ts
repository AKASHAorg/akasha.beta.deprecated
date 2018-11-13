import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import fetchComment from './get-comment';

const commentsIterator = {
    'id': '/commentsIterator',
    'type': 'object',
    'properties': {
        'limit': {'type': 'number'},
        'entryId': {'type': 'string'},
        'toBlock': {'type': 'number'},
        'parent': {'type': 'string'},
        'author': {'type': 'string', 'format': 'address'}
    },
    'required': ['entryId', 'toBlock']
};

/**
 * Get entries indexed by tag
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: {
    toBlock: number, more?: boolean,
    limit?: number, entryId?: string, parent?: string, author?: string, lastIndex?: number, reversed?: boolean
}) {
    const v = new schema.Validator();
    v.validate(data, commentsIterator, {throwError: true});

    const collection = [];
    if (data.more) {
        return {collection: collection, lastBlock: 0, lastIndex: 0};
    }
    const filter = data.parent ?
        {entryId: data.entryId, author: data.author, parent: data.parent} :
        {entryId: data.entryId, author: data.author};
    const commentsCount = yield contracts.instance.Comments.totalComments(data.entryId);
    const maxResults = commentsCount.toNumber();
    const fetched = yield contracts
        .fromEvent(
            contracts.instance.Comments.Publish,
            filter,
            data.toBlock, maxResults,
            {lastIndex: data.lastIndex, reversed: data.reversed});

    for (let event of fetched.results) {
        const comment = yield fetchComment.execute({
            commentId: event.args.id,
            entryId: event.args.entryId,
            noResolve: true
        });
        collection.push(Object.assign({},
            comment,
            {commentId: event.args.id, parent: event.args.parent}));
    }

    return {collection: collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex};
});

export default {execute, name: 'commentsIterator'};

