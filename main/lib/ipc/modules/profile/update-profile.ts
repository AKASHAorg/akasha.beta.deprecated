import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import getCurrentProfile from '../registry/current-profile';
import { create } from './ipfs';
import { module as userModule } from '../auth/index';

/**
 * Update ipfs profile info
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: ProfileUpdateRequest) {
    const ipfsHash = yield create(data.ipfs);
    const currentProfile = yield getCurrentProfile.execute();
    if (!currentProfile.profileAddress) {
        throw new Error('No profile found to update');
    }

    const txData = yield contracts.instance.profile
        .updateHash(
        ipfsHash,
        currentProfile.profileAddress,
        data.gas
    );
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx };
});

export default { execute, name: 'updateProfileData' };
