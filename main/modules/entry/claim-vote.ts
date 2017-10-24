import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const claimVote = {
    'id': '/claimVote',
    'type': 'object',
    'properties': {
        'entryId': { 'type': 'string' },
        'token': { 'type': 'string' }
    },
    'required': ['entryId', 'token']
};

/**
 * Claim vote
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { entryId: string, token: string }, cb) {
    const v = new schema.Validator();
    v.validate(data, claimVote, { throwError: true });

    const txData = contracts.instance.Votes.claimKarmaVote.request(data.entryId, { gas: 200000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt };
});

export default { execute, name: 'claimVote', hasStream: true };
