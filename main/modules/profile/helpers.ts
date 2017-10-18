import contracts from '../../contracts/index';
import * as Promise from 'bluebird';
import { unpad } from 'ethereumjs-util';

export const profileAddress = Promise.coroutine(function*(data) {
    let profileAddress;
    if (data.akashaId) {
        const nameHash = yield contracts.instance.ProfileRegistrar.hash(data.akashaId);
        profileAddress = yield contracts.instance.ProfileResolver.addr(nameHash);
    } else if (data.ethAddress) {
        profileAddress = data.ethAddress;
    }

    if (!!unpad(profileAddress)) {
        return Promise.resolve(profileAddress);
    }
    throw new Error('Must provide a valid akasha ID or ethereum address');
});
