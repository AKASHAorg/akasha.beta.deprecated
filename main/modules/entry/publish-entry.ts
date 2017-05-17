import auth from '../auth/Auth';
import IpfsEntry from './ipfs';
import { uniq } from 'ramda';
import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Create a new Entry
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: EntryCreateRequest) {
    let ipfsEntry = new IpfsEntry();
    data.tags = uniq(data.tags);
    const hash = yield ipfsEntry.create(data.content, data.tags);
    const txData = yield contracts.instance.entries.publish(hash, data.tags, data.gas);
    const tx = yield auth.signData(txData, data.token);
    ipfsEntry = null;
    return { tx };
});

export default { execute, name: 'publish' };
