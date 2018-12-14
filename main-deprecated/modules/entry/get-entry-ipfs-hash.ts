import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { encodeHash } from '../ipfs/helpers';
import { unpad } from 'ethereumjs-util';
import { profileAddress } from '../profile/helpers';
import schema from '../utils/jsonschema';

const getEntryIpfsHash = {
    'id': '/getEntryIpfsHash',
    'type': 'object',
    'properties': {
        'entryId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'akashaId': { 'type': 'string' }
    },
    'required': ['entryId']
};

/**
 * Fetch entry ipfs hash from entryId
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntryGetRequest) {
    const v = new schema.Validator();
    v.validate(data, getEntryIpfsHash, { throwError: true });

    let ipfsHash;
    const ethAddress = yield profileAddress(data);
    const [fn, digestSize, hash] = yield contracts.instance.Entries.getEntry(ethAddress, data.entryId);
    if (!!unpad(hash)) {
        ipfsHash = encodeHash(fn, digestSize, hash);
    }
    return { ipfsHash };
});

export default { execute, name: 'getEntryIpfsHash' };
