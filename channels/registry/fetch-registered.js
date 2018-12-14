import * as Promise from 'bluebird';
import { CORE_MODULE, REGISTRY_MODULE } from '@akashaproject/common/constants';
export const fetchRegisteredSchema = {
    id: '/fetchRegistered',
    type: 'object',
    properties: {
        toBlock: { type: 'number' },
        limit: { type: 'number' },
    },
    required: ['toBlock'],
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, fetchRegisteredSchema, { throwError: true });
        const collection = [];
        const maxResults = data.limit || 5;
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const web3Api = getService(CORE_MODULE.WEB3_API);
        const fetched = yield contracts.fromEvent(contracts.instance.ProfileRegistrar.Register, {}, data.toBlock, maxResults, {});
        for (const event of fetched.results) {
            collection.push({ akashaId: web3Api.instance.toUtf8(event.args.label) });
        }
        return { collection, lastBlock: fetched.fromBlock };
    });
    const fetchRegistered = { execute, name: 'fetchRegistered' };
    const service = function () {
        return fetchRegistered;
    };
    sp().service(REGISTRY_MODULE.fetchRegistered, service);
    return fetchRegistered;
}
//# sourceMappingURL=fetch-registered.js.map