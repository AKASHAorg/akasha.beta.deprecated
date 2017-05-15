import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Fetch entry ipfs hash from entryId
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: EntryGetRequest) {
    const entryEth = yield contracts.instance.entries.getEntry(data.entryId);
    return {ipfsHash: entryEth.ipfsHash};
});

export default {execute, name: 'getEntryIpfsHash'};