import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import auth from '../auth/Auth';
import pinner, { ObjectType, OperationType } from '../pinner/runner';
import { mixed } from '../models/records';

const execute = Promise.coroutine(function*(data: ProfileFollowRequest) {
    const txData = yield contracts.instance.feed.unFollow(data.akashaId, data.gas);
    const tx = yield auth.signData(txData, data.token);
    mixed.flush();
    pinner.execute({ type: ObjectType.PROFILE, id: data.akashaId, operation: OperationType.REMOVE });
    return { tx, akashaId: data.akashaId };
});

export default { execute, name: 'unFollowProfile' };
