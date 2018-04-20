import IpfsEntry from './ipfs';
import { decodeHash } from '../ipfs/helpers';
import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import entriesCache from '../notifications/entries';

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
    const ipfsHash = yield ipfsEntry.create(data.content, data.tags, data.entryType);
    const decodedHash = decodeHash(ipfsHash);
    let publishMethod;
    switch (data.entryType) {
        case 0:
            publishMethod = contracts.instance.Entries.publishArticle;
            break;
        case 1:
            publishMethod = contracts.instance.Entries.publishLink;
            break;
        case 2:
            publishMethod = contracts.instance.Entries.publishMedia;
            break;
        default:
            publishMethod = contracts.instance.Entries.publishOther;
    }
    const txData = publishMethod.request(...decodedHash, data.tags, { gas: 800000 });
    ipfsEntry = null;
    delete data.content;
    delete data.tags;
    const transaction = yield contracts.send(txData, data.token, cb);
    // in the future extract this from receipt
    let entryId = null;
    const receipt = transaction.receipt;
    // in the future extract this should be dynamic @TODO
    if (receipt.logs && receipt.logs.length > 2) {
        const log = receipt.logs[receipt.logs.length - 1];
        entryId = log.topics.length > 2 ? log.topics[2] : null;
    }

    yield entriesCache.push(entryId);
    return { tx: transaction.tx, receipt: transaction.receipt, entryId: entryId };
});

export default { execute, name: 'publish', hasStream: true };
