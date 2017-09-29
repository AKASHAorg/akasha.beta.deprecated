import IpfsEntry from './ipfs';
import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { decodeHash } from '../ipfs/helpers';

const update = {
    'id': '/publish',
    'type': 'object',
    'properties': {
        'content': {
            'type': 'object'
        },
        'token': {
            'type': 'string'
        }
    },
    'required': ['content', 'token']
};

/**
 * Update ipfsHash for entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntryUpdateRequest, cb) {
    const v = new schema.Validator();
    v.validate(data, update, { throwError: true });

    let ipfsEntry = new IpfsEntry();
    const ipfsHash = yield ipfsEntry.create(data.content, []);
    const decodedHash = decodeHash(ipfsHash);

    const txData = yield contracts.instance.Entries.edit.request(data.entryId, ...decodedHash);
    const transaction = yield contracts.send(txData, data.token, cb);

    ipfsEntry = null;
    return { tx: transaction.tx, receipt: transaction.receipt };
});

export default { execute, name: 'update', hasStream: true };
