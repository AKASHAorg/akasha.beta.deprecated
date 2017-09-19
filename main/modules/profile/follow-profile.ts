import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import pinner, { ObjectType, OperationType } from '../pinner/runner';
import { mixed } from '../models/records';

/**
 * Follow an akasha profile
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileFollowRequest, cb) {
    let profileAddress;
    console.log(contracts.instance.Feed.follow);
    if (data.akashaId) {
        profileAddress = yield contracts.instance.ProfileResolver.addr(data.akashaId);
    } else if (data.ethAddress) {
        profileAddress = data.ethAddress;
    }
    if (!profileAddress) {
        throw new Error('Must provide an akasha ID or ethereum address');
    }
    const txData = yield contracts.instance.Feed.follow.request(profileAddress, { gas: 400000 });
    const tx = yield contracts.send(txData, data.token, cb);
    mixed.flush();
    pinner.execute({ type: ObjectType.PROFILE, id: data.akashaId, operation: OperationType.ADD });
    return { tx, akashaId: data.akashaId };
});

export default { execute, name: 'followProfile', hasStream: true };
