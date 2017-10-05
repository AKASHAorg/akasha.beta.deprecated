import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import getEntryHash from './get-entry-ipfs-hash';

const execute = Promise.coroutine(function* (data: EntryGetRequest) {
    const entryEth = yield getEntryHash.execute(data);
    const entryIpfs = yield IpfsConnector.getInstance().api.get(entryEth.ipfsHash);
    const version = entryIpfs.version || null;
    return { version: version };
});


export default { execute, name: 'getLatestEntryVersion' };
