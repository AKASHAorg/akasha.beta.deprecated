import IpfsEntry from './ipfs';
import { decodeHash } from '../ipfs/helpers';
import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const publish = {
    'id': '/publish',
    'type': 'object',
    'properties': {
        'content': {
            'type': 'object'
        },
        'tags': {
            'type': 'array',
            'items': {
                'type': 'string'
            },
            'uniqueItems': true,
            'minItems': 1
        },
        'entryType': {
            'type': 'number'
        },
        'token': {
            'type': 'string'
        }
    },
    'required': ['content', 'tags', 'entryType', 'token']
};

/**
 * Create a new Entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntryCreateRequest, cb) {
    const v = new schema.Validator();
    v.validate(data, publish, { throwError: true });

    let ipfsEntry = new IpfsEntry();
    const ipfsHash = yield ipfsEntry.create(data.content, data.tags);
    const decodedHash = decodeHash(ipfsHash);

    const txData = contracts.instance.Entries.publishArticle.request(...decodedHash, data.tags, data.entryType, { gas: 2000000 });
    ipfsEntry = null;
    delete data.content;
    delete data.tags;
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt };
});

export default { execute, name: 'publish', hasStream: true };
