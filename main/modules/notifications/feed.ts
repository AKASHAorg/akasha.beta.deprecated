import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { profileAddress } from '../profile/helpers';
import queue from './queue';

const watchFollow = {
    'id': '/watchFollow',
    'type': 'object',
    'properties': {
        'akashaId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'fromBlock': { 'type': 'number'}
    }
};
const EVENT_TYPE = 'FOLLOWING_EVENT';
export const execute = Promise.coroutine(function* (
    data: { ethAddress?: string, akashaId?: string, fromBlock: number }, cb) {

    const v = new schema.Validator();
    v.validate(data, watchFollow, { throwError: true });
    const ethAddress = yield profileAddress(data);

    const followEvent = contracts.createWatcher(contracts.instance.Feed.Follow, { followed: ethAddress }, data.fromBlock);

    followEvent.watch((err, ev) => {
       if (!err) {
           queue.push(cb, { type: EVENT_TYPE, payload: ev.args, blockNumber: ev.blockNumber });
       }
    });

    return { watching: true };
});
