import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const canClaimVote = {
    'id': '/canClaim',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'entries': {
            'type': 'array',
            'items': {
                'type': 'string'
            },
            'uniqueItems': true,
            'minItems': 1
        }
    },
    'required': ['ethAddress', 'entries']
};


const execute = Promise.coroutine(
    /**
     * @param data
     * @returns {{collection: any}}
     */
    function* (data: { entries: string[], ethAddress: string }) {
        const v = new schema.Validator();
        v.validate(data, canClaimVote, { throwError: true });

        const timeStamp = new Date().getTime() / 1000;
        const requests = data.entries.map((id) => {
            return contracts.instance.Votes
                .canClaimEntryVote(id, data.ethAddress, timeStamp)
                .then((status) => {
                    return { entryId: id, status };
                });
        });
        const collection = yield Promise.all(requests);
        return { collection };
    });

export default { execute, name: 'canClaimVote' };
