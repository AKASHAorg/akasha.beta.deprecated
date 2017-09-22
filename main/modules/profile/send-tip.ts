import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';

const execute = Promise.coroutine(
    function* (data: {
        token: string,
        akashaId: string,
        value: string,
        tokenAmount?: string,
        gas?: number,
        message?: string
    }, cb) {
        const address = yield profileAddress(data);
        const txData = yield contracts.instance.AETH.donate.request(address, data.tokenAmount, data.message, {
            value: data.value,
            gas: data.gas
        });
        const tx = yield contracts.send(txData, data.token, cb);
        return { tx, receiver: address, akashaId: data.akashaId, hasStream: true };
    });

export default { execute, name: 'tip' };
