import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import pinner, { ObjectType, OperationType } from '../pinner/runner';
import schema from '../utils/jsonschema';
import { downvote as upvote } from './downvote-entry';

/**
 * Upvote entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntryUpvoteRequest, cb) {
    const v = new schema.Validator();
    v.validate(data, upvote, { throwError: true });

    if (data.weight < 1 || data.weight > 10) {
        throw new Error('Vote weight value must be between 1-10');
    }

    const txData = yield contracts.instance.Votes.voteEntry.request(data.weight, data.entryId, false, data.ethAddress, { gas: 200000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    pinner.execute({ type: ObjectType.ENTRY, id: data.entryId, operation: OperationType.ADD });
    return { tx: transaction.tx, receipt: transaction.receipt };
});

export default { execute, name: 'upvote', hasStream: true };
