import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';
import { mixed } from '../models/records';
import schema from '../utils/jsonschema';
import { followProfile } from './follow-profile';

const execute = Promise.coroutine(function* (data: ProfileFollowRequest, cb) {
    const v = new schema.Validator();
    v.validate(data, followProfile, { throwError: true });

    const address = yield profileAddress(data);
    const txData = contracts.instance.Feed.unFollow.request(address, { gas: 400000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    mixed.flush();
    return { tx: transaction.tx, receipt: transaction.receipt, akashaId: data.akashaId };
});

export default { execute, name: 'unFollowProfile', hasStream: true };
