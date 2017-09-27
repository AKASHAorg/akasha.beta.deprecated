import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import getCurrentProfile from '../registry/current-profile';
import { create } from './ipfs';
import { decodeHash } from '../ipfs/helpers';

/**
 * Update ipfs profile info
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileUpdateRequest, cb) {
    const ipfsHash = yield create(data.ipfs);
    const decodedHash = decodeHash(ipfsHash);
    const currentProfile = yield getCurrentProfile.execute();
    if (!currentProfile.profileAddress) {
        throw new Error('No profile found to update');
    }

    const txData = yield contracts.instance.ProfileResolver
        .setHash.request(
            data.akashaIdHash,
            decodedHash
        );
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt};
});

export default { execute, name: 'updateProfileData', hasStream: true };
