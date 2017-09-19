import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import pinner, { ObjectType, OperationType } from '../pinner/runner';
import { mixed } from '../models/records';
import { profileAddress } from './helpers';
/**
 * Follow an akasha profile
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileFollowRequest, cb) {
    const address = yield profileAddress(data);
    const txData = yield contracts.instance.Feed.follow.request(address, { gas: 400000 });
    const tx = yield contracts.send(txData, data.token, cb);
    mixed.flush();
    pinner.execute({ type: ObjectType.PROFILE, id: data.akashaId, operation: OperationType.ADD });
    return { tx, akashaId: data.akashaId };
});

export default { execute, name: 'followProfile', hasStream: true };
