import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { module as userModule } from '../auth/index';
import pinner, { ObjectType, OperationType } from '../pinner/runner';
import { mixed } from '../models/records';
/**
 * Follow an akasha profile
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: ProfileFollowRequest) {
    const txData = yield contracts.instance.feed.follow(data.akashaId, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    mixed.flush();
    pinner.execute({ type: ObjectType.PROFILE, id: data.akashaId, operation: OperationType.ADD });
    return { tx, akashaId: data.akashaId };
});

export default { execute, name: 'followProfile' };
