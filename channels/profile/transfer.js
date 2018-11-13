import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
export const transfer = {
    id: '/transfer',
    type: 'object',
    properties: {
        ethAddress: { type: 'string', format: 'address' },
        akashaId: { type: 'string' },
        token: { type: 'string' },
        value: { type: 'string' },
        tokenAmount: { type: 'string' },
    },
    required: ['token'],
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, transfer, { throwError: true });
        const web3Api = getService(CORE_MODULE.WEB3_API);
        const contracts = getService(CORE_MODULE.CONTRACTS);
        if (data.tokenAmount && data.value) {
            throw new Error('Can only send eth or aeth token individually, not combined');
        }
        const address = yield (getService(COMMON_MODULE.profileHelpers))
            .profileAddress(data);
        const tokenAmount = web3Api.instance.toWei(data.tokenAmount || 0, 'ether');
        const ethAmount = web3Api.instance.toWei(data.value || 0, 'ether');
        let txData;
        if (data.tokenAmount) {
            txData = contracts.instance.AETH
                .transfer.request(address, tokenAmount, { gas: 200000 });
        }
        else if (data.value) {
            txData = web3Api.instance.eth
                .sendTransaction.request({ to: address, value: ethAmount, gas: 50000 });
        }
        const receipt = yield contracts.send(txData, data.token, cb);
        return {
            receipt,
            receiver: address,
            akashaId: data.akashaId,
        };
    });
    const transferService = { execute, name: 'transfer', hasStream: true };
    const service = function () {
        return transferService;
    };
    sp().service(PROFILE_MODULE.transfer, service);
    return transferService;
}
//# sourceMappingURL=transfer.js.map