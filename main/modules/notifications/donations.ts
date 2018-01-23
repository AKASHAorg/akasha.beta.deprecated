import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { profileAddress } from '../profile/helpers';
import queue from './queue';
import GethConnector from '@akashaproject/geth-connector/lib/GethConnector';


const watchDonate = {
    'id': '/watchDonate',
    'type': 'object',
    'properties': {
        'akashaId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'fromBlock': { 'type': 'number' }
    }
};
const EVENT_TYPE = 'DONATION_EVENT';
export const execute = Promise.coroutine(function* (data: { ethAddress?: string, akashaId?: string, fromBlock: number }, cb) {

    const v = new schema.Validator();
    v.validate(data, watchDonate, { throwError: true });
    const ethAddress = yield profileAddress(data);

    const donateEvent = contracts.createWatcher(contracts.instance.AETH.Donate, { to: ethAddress }, data.fromBlock);

    donateEvent.watch((err, ev) => {
        if (!err) {
            queue.push(
                cb,
                {
                    type: EVENT_TYPE,
                    payload: {
                        from: ev.args.from,
                        aeth: (GethConnector.getInstance().web3.fromWei(ev.args.aeth, 'ether')).toFormat(5),
                        eth: (GethConnector.getInstance().web3.fromWei(ev.args.eth, 'ether')).toFormat(5),
                        message: GethConnector.getInstance().web3.toUtf8(ev.args.extraData)
                    },
                    blockNumber: ev.blockNumber
                }
            );
        }
    });

    return { watching: true };
});
