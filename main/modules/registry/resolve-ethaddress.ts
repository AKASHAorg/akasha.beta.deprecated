import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { unpad } from 'ethereumjs-util';

/**
 * Resolve eth address to profile contract address
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileByAddressRequest) {
    let profileAddress = yield contracts.instance.registry.getByAddress(data.ethAddress);
    if (!unpad(profileAddress)) {
        profileAddress = null;
    }
    const akashaId = (profileAddress) ? yield contracts.instance.profile.getId(profileAddress) : null;
    return { profileAddress, akashaId };
});

export default { execute, name: 'getByAddress' };
