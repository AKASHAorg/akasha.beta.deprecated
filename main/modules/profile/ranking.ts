import * as Promise from 'bluebird';
import schema from '../utils/jsonschema';
import contracts from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';

export const karmaRanking = {
    'id': '/karmaRanking',
    'type': 'object',
    'properties': {
        'following': {
            'type': 'array',
            'items': {
                'type': 'string'
            },
            'uniqueItems': true,
            'minItems': 1
        }
    },
    'required': ['following']
};


const execute = Promise.coroutine(function* (data: { following: string[] }) {
    const v = new schema.Validator();
    v.validate(data, karmaRanking, { throwError: true });

    if (!data.following) {
        return {};
    }
    const collection = [];
    const dataCopyFollowing = Array.from(data.following);
    dataCopyFollowing.push(GethConnector.getInstance().web3.eth.defaultAccount);
    for (let i = 0; i < dataCopyFollowing.length; i++) {
        const [karma, ] = yield contracts.instance.Essence.getCollected(dataCopyFollowing[i]);
        collection.push({ethAddress: dataCopyFollowing[i], karma: (GethConnector.getInstance().web3.fromWei(karma)).toNumber()});
    }

    collection.sort((first, second) => {
       return second.karma - first.karma;
    });

    const rankedCollection = collection.map((v, i) => {
       return Object.assign({}, v, { rank: i });
    });

    const myRanking = collection.findIndex((profile) => {
      return profile.ethAddress === GethConnector.getInstance().web3.eth.defaultAccount;
    });

    return { collection: rankedCollection, myRanking };
});

export default { execute, name: 'karmaRanking'};
