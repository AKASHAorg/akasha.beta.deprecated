import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';
const voteEndPeriod = {
    id: '/voteEndPeriod',
    type: 'array',
    items: { type: 'string' },
    minItems: 1,
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, voteEndPeriod, { throwError: true });
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const collection = [];
        for (let i = 0; i < data.length; i++) {
            const record = yield contracts.instance.Votes.getRecord(data[i]);
            collection.push({ entryId: data[i], endDate: (record[2]).toNumber() });
        }
        return { collection };
    });
    const getVoteEndPeriod = { execute, name: 'getVoteEndPeriod' };
    const service = function () {
        return getVoteEndPeriod;
    };
    sp().service(ENTRY_MODULE.getVoteEndPeriod, service);
    return getVoteEndPeriod;
}
//# sourceMappingURL=vote-endperiod.js.map