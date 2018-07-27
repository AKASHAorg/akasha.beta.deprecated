"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.karmaRankingSchema = {
    id: '/karmaRanking',
    type: 'object',
    properties: {
        following: {
            type: 'array',
            items: {
                type: 'string',
            },
            uniqueItems: true,
            minItems: 1,
        },
    },
    required: ['following'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.karmaRankingSchema, { throwError: true });
        if (!data.following) {
            return {};
        }
        const collection = [];
        const dataCopyFollowing = Array.from(data.following);
        const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
        const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
        dataCopyFollowing.push(web3Api.instance.eth.defaultAccount);
        for (let i = 0; i < dataCopyFollowing.length; i++) {
            const [karma] = yield contracts.instance.Essence.getCollected(dataCopyFollowing[i]);
            collection.push({
                ethAddress: dataCopyFollowing[i],
                karma: (web3Api.instance.fromWei(karma)).toNumber(),
            });
        }
        collection.sort((first, second) => {
            return second.karma - first.karma;
        });
        const rankedCollection = collection.map((v, i) => {
            return Object.assign({}, v, { rank: i });
        });
        const myRanking = collection.findIndex((profile) => {
            return profile.ethAddress === web3Api.instance.eth.defaultAccount;
        });
        return { collection: rankedCollection, myRanking };
    });
    const karmaRanking = { execute, name: 'karmaRanking' };
    const service = function () {
        return karmaRanking;
    };
    sp().service(constants_1.PROFILE_MODULE.karmaRanking, service);
    return karmaRanking;
}
exports.default = init;
//# sourceMappingURL=ranking.js.map