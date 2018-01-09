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
    data.following.push(GethConnector.getInstance().web3.eth.defaultAccount);
    for (let i = 0; i < data.following.length; i++) {
        const [karma, ] = yield contracts.instance.Essence.getCollected(data.following[i]);
        collection.push({ethAddress: data.following[i], karma: (GethConnector.getInstance().web3.fromWei(karma)).toNumber()});
    }

    collection.sort((first, second) => {
       return second.karma - first.karma;
    });

    const myRanking = collection.findIndex((profile) => {
      return profile.ethAddress === GethConnector.getInstance().web3.eth.defaultAccount;
    });

    return { collection, myRanking };
});

export default { execute, name: 'karmaRanking'};
