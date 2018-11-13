import * as Promise from 'bluebird';
import { COMMENTS_MODULE, COMMON_MODULE, CORE_MODULE } from '@akashaproject/common/constants';
export const getVoteOfSchema = {
    id: '/getVoteOf',
    type: 'array',
    items: {
        type: 'object',
        properties: {
            commentId: { type: 'string' },
            akashaId: { type: 'string' },
            ethAddress: { type: 'string', format: 'address' },
        },
        required: ['commentId'],
    },
    uniqueItems: true,
    minItems: 1,
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, getVoteOfSchema, { throwError: true });
        const profileAddress = (getService(COMMON_MODULE.profileHelpers)).profileAddress;
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const requests = data.map((req) => {
            return profileAddress(req).then((ethAddress) => {
                return contracts.instance.Votes.voteOf(ethAddress, req.commentId);
            }).then((vote) => {
                return Object.assign({}, req, { vote: vote.toString(10) });
            });
        });
        const collection = yield Promise.all(requests);
        return { collection };
    });
    const getVoteOf = { execute, name: 'getVoteOf' };
    const service = function () {
        return getVoteOf;
    };
    sp().service(COMMENTS_MODULE.getVoteOf, service);
    return getVoteOf;
}
//# sourceMappingURL=vote-of.js.map