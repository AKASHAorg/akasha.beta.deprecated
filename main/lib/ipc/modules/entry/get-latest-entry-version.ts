import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

const execute = Promise.coroutine(function*(data: { entryId?: string }){
    let entryEth = yield contracts.instance.entries.getEntry(data.entryId);
    let entryIpfs =  yield IpfsConnector.getInstance().api.get(entryEth.ipfsHash);
    let version = entryIpfs.version || null;
    return { version: version };
});


export default { execute, name: 'getLatestEntryVersion' };