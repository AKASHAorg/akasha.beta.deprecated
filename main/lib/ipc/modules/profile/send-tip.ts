import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { module as userModule } from '../auth/index';
import addressOf from '../registry/address-of-akashaid';

const execute = Promise.coroutine(function*(data: {token: string, receiver: string, akashaId: string, value: string, unit?: string, gas?: number}) {
    const validateReceiver = yield addressOf.execute([{akashaId: data.akashaId}]);
    if(validateReceiver.collection[0] !== data.receiver){
        throw new Error("Cannot validate receiver's address.");
    }
    const txData = yield contracts.instance.profile.sendTip(data.receiver, data.value, data.unit, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx, receiver: data.receiver, akashaId: data.akashaId };
});

export default { execute, name: 'tip' };
