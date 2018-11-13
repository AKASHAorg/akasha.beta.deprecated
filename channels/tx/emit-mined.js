import * as Promise from 'bluebird';
import { CORE_MODULE, TX_MODULE } from '@akashaproject/common/constants';
export const emitMinedSchema = {
    id: '/emitMined',
    type: 'object',
    properties: {
        watch: { type: 'bool' },
    },
    required: ['watch'],
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, emitMinedSchema, { throwError: true });
        const web3Helper = getService(CORE_MODULE.WEB3_HELPER);
        (data.watch) ? web3Helper.startTxWatch() : web3Helper.stopTxWatch();
        return { watching: web3Helper.watching };
    });
    const emitMined = { execute, name: 'emitMined' };
    const service = function () {
        return emitMined;
    };
    sp().service(TX_MODULE.emitMined, service);
    return emitMined;
}
//# sourceMappingURL=emit-mined.js.map