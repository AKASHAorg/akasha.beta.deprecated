import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { module as userModule } from '../auth/index';

const execute = Promise.coroutine(function*(data: ProfileFollowRequest) {
    const txData =  yield contracts.instance.feed.unFollow(data.profileAddress, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx, profileAddress: data.profileAddress };
});

export default { execute, name: 'unFollowProfile' };
