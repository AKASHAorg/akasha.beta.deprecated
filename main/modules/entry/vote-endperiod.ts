import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const voteEndPeriod = {
    'id': '/voteEndPeriod',
    'type': 'object',
    'properties': {
        'entryId': { 'type': 'string' }
    },
    'required': ['entryId']
};

const execute = Promise.coroutine(function* (data: { entryId: string }) {
    const v = new schema.Validator();
    v.validate(data, voteEndPeriod, { throwError: true });

    const record = yield contracts.instance.Votes.getRecord(data.entryId);
    return { endDate: (record[2]).toNumber() };
});

export default { execute, name: 'getVoteEndPeriod' };
