import IpfsEntry from './ipfs';
import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { decodeHash, encodeHash } from '../ipfs/helpers';
import { unpad } from 'ethereumjs-util';
const update = {
    'id': '/publish',
    'type': 'object',
    'properties': {
        'content': {
            'type': 'object'
        },
        'token': {
            'type': 'string'
        },
        'tags': {
            'type': 'array',
            'items': {
                'type': 'string'
            },
            'uniqueItems': true,
            'minItems': 1
        },
        'ethAddress': {'type': 'string', 'format': 'address'}
    },
    'required': ['content', 'token', 'tags', 'ethAddress']
};

/**
 * Update ipfsHash for entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntryUpdateRequest, cb) {
    const v = new schema.Validator();
    v.validate(data, update, { throwError: true });

    let ipfsEntry = new IpfsEntry();
    const [fn, digestSize, hash] = yield contracts.instance.Entries.getEntry(data.ethAddress, data.entryId);

    if (!unpad(hash)) {
        throw new Error(`entryId: ${data.entryId} published by ${data.ethAddress} does not exits`);
    }

    const ipfsHashPublished = encodeHash(fn, digestSize, hash);
    const ipfsHash = yield ipfsEntry.edit(data.content, data.tags, ipfsHashPublished);
    const decodedHash = decodeHash(ipfsHash);
    delete data.content;
    delete data.tags;
    ipfsEntry = null;
    const txData = contracts.instance.Entries.edit.request(data.entryId, ...decodedHash);
    const transaction = yield contracts.send(txData, data.token, cb);

    return { tx: transaction.tx, receipt: transaction.receipt };
});

export default { execute, name: 'editEntry', hasStream: true };
