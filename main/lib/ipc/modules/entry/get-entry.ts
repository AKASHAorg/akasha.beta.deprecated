import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import {getShortContent, getFullContent} from './ipfs';
import { generalSettings, BASE_URL } from '../../config/settings';

/**
 * Fetch entry from entryId
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntryGetRequest) {
    const entryEth = yield contracts.instance.entries.getEntry(data.entryId);
    const content = (data.full) ? yield getFullContent(entryEth.ipfsHash): yield getShortContent(entryEth.ipfsHash);
    return { [BASE_URL]: generalSettings.get(BASE_URL), content, entryEth, entryId: data.entryId };
});

export default { execute, name: 'getEntry'};

