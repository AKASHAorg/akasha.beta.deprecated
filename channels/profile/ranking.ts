import * as Promise from 'bluebird';
import { CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

export const karmaRankingSchema = {
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

export default function init(sp, getService) {

  const execute = Promise.coroutine(function* (data) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, karmaRankingSchema, { throwError: true });

    if (!data.following) {
      return {};
    }
    const collection = [];
    const dataCopyFollowing = Array.from(data.following);
    const web3Api = getService(CORE_MODULE.WEB3_API);
    const contracts = getService(CORE_MODULE.CONTRACTS);
    dataCopyFollowing.push(web3Api.instance.eth.defaultAccount);
    for (let i = 0; i < dataCopyFollowing.length; i++) {
      const [karma] = yield contracts.instance.Essence.getCollected(dataCopyFollowing[i]);
      collection.push(
        {
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
  sp().service(PROFILE_MODULE.karmaRanking, service);
  return karmaRanking;
}
