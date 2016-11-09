import { module as userModule } from '../auth/index';
import IpfsEntry from './ipfs';
import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Create a new Entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntryCreateRequest) {
    const ipfsEntry = new IpfsEntry();
    const hash = yield ipfsEntry.create(data.content, data.tags);
    const txData = yield contracts.instance.entries.publish(hash, data.tags, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx };
});

export default {execute, name: 'publish'};
