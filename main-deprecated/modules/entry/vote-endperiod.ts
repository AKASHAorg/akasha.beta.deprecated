import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const voteEndPeriod = {
    'id': '/voteEndPeriod',
    'type': 'array',
    'items': { 'type': 'string' },
    'minItems': 1
};

const execute = Promise.coroutine(function* (data: string[]) {
    const v = new schema.Validator();
    v.validate(data, voteEndPeriod, { throwError: true });
    const collection = [];
    for (let i = 0; i < data.length; i++) {
        const record = yield contracts.instance.Votes.getRecord(data[i]);
        collection.push({entryId: data[i], endDate: (record[2]).toNumber()});
    }
    return { collection };
});

export default { execute, name: 'getVoteEndPeriod' };
