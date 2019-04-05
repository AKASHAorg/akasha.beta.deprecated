import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';
export const getVoteOfS = {
    id: '/getVoteOf',
    type: 'object',
    properties: {
        list: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    entryId: { type: 'string' },
                    akashaId: { type: 'string' },
                    ethAddress: { type: 'string', format: 'address' },
                },
                required: ['entryId'],
            },
            uniqueItems: true,
            minItems: 1,
        },
    },
    required: ['list'],
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, getVoteOfS, { throwError: true });
        const profileAddress = getService(COMMON_MODULE).profileAddress;
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const web3Api = getService(CORE_MODULE.WEB3_API);
        const requests = data.list.map((req) => {
            return profileAddress(req).then((ethAddress) => {
                return Promise.all([
                    contracts.instance.Votes.voteOf(ethAddress, req.entryId),
                    contracts.instance.Votes.karmaOf(ethAddress, req.entryId),
                ]);
            }).spread((vote, karma) => {
                return Object.assign({}, req, { vote: vote.toString(), essence: (web3Api.instance.utils.toBN(web3Api.instance.utils.fromWei(web3Api.instance.utils.toBN(karma[0])))).toNumber(), claimed: karma[1] });
            });
        });
        const collection = yield Promise.all(requests);
        return { collection };
    });
    const getVoteOf = { execute, name: 'getVoteOf' };
    const service = function () {
        return getVoteOf;
    };
    sp().service(ENTRY_MODULE.getVoteOf, service);
    return getVoteOf;
}
//# sourceMappingURL=get-vote-of.js.map