import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { module as userModule } from '../auth/index';

const execute = Promise.coroutine(function*(data: {token: string, receiver: string, value: string, unit?: string, gas?: number}) {
    const txData = yield contracts.instance.profile.sendTip(data.receiver, data.value, data.unit, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx, receiver: data.receiver };
});

export default { execute, name: 'tip' };
