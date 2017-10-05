import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const getScore = {
    'id': '/getScore',
    'type': 'object',
    'properties': {
        'entryId': {'type': 'string'}
    },
    'required': ['entryId']
};

/**
 * Get score of an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { entryId: string }) {
    const v = new schema.Validator();
    v.validate(data, getScore, { throwError: true });

    const score = yield contracts.instance.Votes.getRecord(data.entryId);
    return { score: (score[1]).toString(10), entryId: data.entryId };
});

export default { execute, name: 'getScore' };
