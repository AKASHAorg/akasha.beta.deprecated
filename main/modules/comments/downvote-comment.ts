/*!
 * Copyright akasha
 */
import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

export const downvote = {
    'id': '/downvote',
    'type': 'object',
    'properties': {
        'entryId': { 'type': 'string' },
        'token': { 'type': 'string' },
        'commentId': { 'type': 'string' },
        'weight': { 'type': 'number' }
    },
    'required': ['entryId', 'token', 'commentId', 'weight']
};

/**
 * Downvote comment
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { entryId: string, weight: number,
    commentId: string, token: string}, cb) {

    const v = new schema.Validator();
    v.validate(data, downvote, { throwError: true });

    if (data.weight < 1 || data.weight > 10) {
        throw new Error('Vote weight value must be between 1-10');
    }

    const txData = contracts.instance.Votes.voteComment.request(data.weight, data.entryId, data.commentId, true, { gas: 200000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt };
});

export default { execute, name: 'downvote', hasStream: true };
