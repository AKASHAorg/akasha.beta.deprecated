import * as Promise from 'bluebird';
import { getShortProfile } from './ipfs';
import { SHORT_WAIT_TIME } from '../../config/settings';
/**
 * @type {Function}
 */
const execute = Promise.coroutine(
    function*(data: { ipfsHash: string[] }, cb: any) {
        if (!Array.isArray(data.ipfsHash)) {
            throw new Error('data is must be an array');
        }
        data.ipfsHash.forEach((profileHash) => {
            getShortProfile(profileHash)
                .timeout(SHORT_WAIT_TIME)
                .then((profile) => {
                    cb(null, { profile, ipfsHash: profileHash });
                })
                .catch((err) => {
                    cb({ message: err.message, ipfsHash: profileHash });
                });
        });
        return {};
    });

export default { execute, name: 'resolveProfileIpfsHash', hasStream: true };
