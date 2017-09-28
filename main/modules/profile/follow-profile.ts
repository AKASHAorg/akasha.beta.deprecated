import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import pinner, { ObjectType, OperationType } from '../pinner/runner';
import { mixed } from '../models/records';
import { profileAddress } from './helpers';
import schema from '../utils/jsonschema';

export const followProfile = {
    'id': '/followProfile',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'akashaId': { 'type': 'string' },
        'token': { 'type': 'string' }
    },
    'required': ['token']
};

/**
 * Follow an akasha profile
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileFollowRequest, cb) {
    const v = new schema.Validator();
    v.validate(data, followProfile, { throwError: true });

    const address = yield profileAddress(data);
    const txData = contracts.instance.Feed.follow.request(address, { gas: 400000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    mixed.flush();
    pinner.execute({ type: ObjectType.PROFILE, id: data.akashaId, operation: OperationType.ADD });
    return { tx: transaction.tx, receipt: transaction.receipt, akashaId: data.akashaId };
});

export default { execute, name: 'followProfile', hasStream: true };
