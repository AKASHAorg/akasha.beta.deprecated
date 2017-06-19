import * as Promise from 'bluebird';
import { getShortContent } from './ipfs';
import { SHORT_WAIT_TIME } from '../../config/settings';

/**
 * Fetch short content from an array of ipfs hashes
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { ipfsHash: string[] }, cb: any) {
    if (!Array.isArray(data.ipfsHash)) {
        throw new Error('data is must be an array');
    }
    data.ipfsHash.forEach((ipfsHash) => {
        getShortContent(ipfsHash)
            .timeout(SHORT_WAIT_TIME)
            .then((entry) => {
                cb(null, { entry, ipfsHash: ipfsHash });
            })
            .catch((err) => {
                cb({ message: err.message, ipfsHash: ipfsHash });
            });
    });
    return {};
});

export default { execute, name: 'resolveEntriesIpfsHash', hasStream: true };
