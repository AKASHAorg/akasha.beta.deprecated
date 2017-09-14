import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import auth from '../auth/Auth';
import pinner, { ObjectType, OperationType } from '../pinner/runner';
import { mixed } from '../models/records';

/**
 * Follow an akasha profile
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileFollowRequest) {
    const txData = yield contracts.instance.feed.follow(data.akashaId, data.gas);
    const tx = yield auth.signData(txData, data.token);
    mixed.flush();
    pinner.execute({ type: ObjectType.PROFILE, id: data.akashaId, operation: OperationType.ADD });
    return { tx, akashaId: data.akashaId };
});

export default { execute, name: 'followProfile' };
