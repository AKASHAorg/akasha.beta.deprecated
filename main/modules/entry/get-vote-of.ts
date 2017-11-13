import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { profileAddress } from '../profile/helpers';
import { GethConnector } from '@akashaproject/geth-connector';

export const getVoteOf = {
    'id': '/getVoteOf',
    'type': 'array',
    'items': {
        'type': 'object',
        'properties': {
            'entryId': { 'type': 'string' },
            'akashaId': { 'type': 'string' },
            'ethAddress': { 'type': 'string', 'format': 'address' }
        },
        'required': ['entryId']
    },
    'uniqueItems': true,
    'minItems': 1
};

/**
 * Get vote weight of akasha id
 * @type {Function}
 */
const execute = Promise.coroutine(
    /**
     *
     * @param data
     * @returns {{collection: any}}
     */
    function* (data: { entryId: string, akashaId?: string, ethAddress?: string }[]) {
        const v = new schema.Validator();
        v.validate(data, getVoteOf, { throwError: true });

        const requests = data.map((req) => {
            return profileAddress(req).then((ethAddress) => {
                return Promise.all([
                    contracts.instance.Votes.voteOf(ethAddress, req.entryId),
                    contracts.instance.Votes.karmaOf(ethAddress, req.entryId)
                ]);
            }).spread((vote, karma) => {
                return { ...req,
                    vote: vote.toString(),
                    essence: (GethConnector.getInstance().web3.fromWei(karma[0])).toFormat(10),
                    claimed: karma[1]
                };
            });
        });

        const collection = yield Promise.all(requests);
        return { collection };
    });

export default { execute, name: 'getVoteOf' };

