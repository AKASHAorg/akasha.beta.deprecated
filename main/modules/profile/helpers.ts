import contracts from '../../contracts/index';
import * as Promise from 'bluebird';

export const profileAddress = Promise.coroutine(function*(data) {
    let profileAddress;
    if (data.akashaId) {
        const nameHash = yield contracts.instance.ProfileRegistrar.hash(data.akashaId);
        profileAddress = yield contracts.instance.ProfileResolver.addr(nameHash);
    } else if (data.ethAddress) {
        profileAddress = data.ethAddress;
    }
    if (!profileAddress) {
        throw new Error('Must provide an akasha ID or ethereum address');
    }
    return Promise.resolve(profileAddress);
});
