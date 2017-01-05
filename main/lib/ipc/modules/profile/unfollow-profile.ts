import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { module as userModule } from '../auth/index';
import pinner, { ObjectType, OperationType } from '../pinner/runner';

const execute = Promise.coroutine(function*(data: ProfileFollowRequest) {
    const txData = yield contracts.instance.feed.unFollow(data.akashaId, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    pinner.execute({ type: ObjectType.PROFILE, id: data.akashaId, operation: OperationType.REMOVE });
    return { tx, akashaId: data.akashaId };
});

export default { execute, name: 'unFollowProfile' };
