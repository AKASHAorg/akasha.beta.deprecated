import * as Promise from 'bluebird';
import auth from '../auth/Auth';
import IpfsEntry from './ipfs';
import contracts from '../../contracts/index';

/**
 *
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntryEditRequest) {
    const active = yield contracts.instance.entries.isMutable(data.entryId);

    if (!active) {
        throw new Error('This entry can no longer be edited.');
    }
    let ipfsEntry = new IpfsEntry();
    const entryEth = yield contracts.instance.entries.getEntry(data.entryId);
    const hash = yield ipfsEntry.edit(data.content, data.tags, entryEth.ipfsHash);
    const txData = yield contracts.instance.entries.updateEntryContent(hash, data.entryId, data.gas);
    const tx = yield auth.signData(txData, data.token);
    ipfsEntry = null;
    return { tx, entryId: data.entryId };
});

export default { execute, name: 'editEntry' };
