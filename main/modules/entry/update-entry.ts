import auth from '../auth/Auth';
import IpfsEntry from './ipfs';
import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Update ipfsHash for entry
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: EntryUpdateRequest) {
    const ipfsEntry = new IpfsEntry();
    const hash = yield ipfsEntry.create(data.content, data.tags);
    const txData = yield contracts.instance.entries.updateEntryContent(hash, data.entryId, data.gas);
    const tx = yield auth.signData(txData, data.token);
    return { tx };
});

export default { execute, name: 'update' };
