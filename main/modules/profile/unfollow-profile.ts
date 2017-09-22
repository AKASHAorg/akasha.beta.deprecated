import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';
import pinner, { ObjectType, OperationType } from '../pinner/runner';
import { mixed } from '../models/records';

const execute = Promise.coroutine(function* (data: ProfileFollowRequest, cb) {
    const address = yield profileAddress(data);
    const txData = contracts.instance.Feed.unFollow.request(address, { gas: 400000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    mixed.flush();
    pinner.execute({ type: ObjectType.PROFILE, id: data.akashaId, operation: OperationType.REMOVE });
    return { tx: transaction.tx, receipt: transaction.receipt, akashaId: data.akashaId };
});

export default { execute, name: 'unFollowProfile', hasStream: true };
