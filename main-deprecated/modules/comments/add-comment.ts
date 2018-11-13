import { create } from './ipfs';
import { decodeHash } from '../ipfs/helpers';
import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';


const comment = {
    'id': '/comment',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'parent': { 'type': 'string' },
        'entryId': { 'type': 'string' },
        'token': { 'type': 'string' }
    },
    'required': ['ethAddress', 'entryId', 'token']
};
/**
 * Create a new comment
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: any, cb) {
    const v = new schema.Validator();
    v.validate(data, comment, { throwError: true });

    const ipfsHash = yield create(data.content);
    const decodedHash = decodeHash(ipfsHash);
    const replyTo = data.parent || '0';
    const txData = contracts.instance
        .Comments.publish.request(data.entryId, data.ethAddress, replyTo, ...decodedHash, { gas: 250000 });

    const transaction = yield contracts.send(txData, data.token, cb);
    let commentId = null;
    const receipt = transaction.receipt;
    // in the future extract this should be dynamic @TODO
    if (receipt.logs && receipt.logs.length > 1) {
        const log = receipt.logs[receipt.logs.length - 1];
        commentId = log.topics.length > 3 ? log.data : null;
    }
    return { tx: transaction.tx, receipt: transaction.receipt, commentId: commentId, entryId: data.entryId };
});

export default { execute, name: 'comment', hasStream: true };
