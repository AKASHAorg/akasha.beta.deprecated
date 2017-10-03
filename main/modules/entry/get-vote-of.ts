import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { profileAddress } from '../profile/helpers';

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
                return contracts.instance.Votes.voteOf(ethAddress, req.entryId);
            }).then((vote) => {
                return { ...req, vote: vote.toString(10) };
            });
        });

        const collection = yield Promise.all(requests);
        return { collection };
    });

export default { execute, name: 'getVoteOf' };

