import * as Promise from 'bluebird';
import { CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
export const bondAethSchema = {
    id: '/bondAeth',
    type: 'object',
    properties: {
        amount: { type: 'string' },
        token: { type: 'string' },
    },
    required: ['amount', 'token'],
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, bondAethSchema, { throwError: true });
        const bnAmount = (getService(CORE_MODULE.WEB3_API))
            .instance.toWei(data.amount, 'ether');
        const txData = (getService(CORE_MODULE.CONTRACTS))
            .instance.AETH.bondAeth.request(bnAmount, { gas: 100000 });
        const receipt = yield (getService(CORE_MODULE.CONTRACTS))
            .send(txData, data.token, cb);
        return { receipt };
    });
    const bondAeth = { execute, name: 'bondAeth', hasStream: true };
    const service = function () {
        return bondAeth;
    };
    sp().service(PROFILE_MODULE.bondAeth, service);
    return bondAeth;
}
//# sourceMappingURL=bond-aeth.js.map