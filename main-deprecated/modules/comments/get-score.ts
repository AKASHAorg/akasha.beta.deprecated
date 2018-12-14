import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const getScore = {
    'id': '/getScore',
    'type': 'object',
    'properties': {
        'commentId': {'type': 'string'}
    },
    'required': ['commentId']
};

/**
 * Get score of an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { commentId: string }) {
    const v = new schema.Validator();
    v.validate(data, getScore, { throwError: true });

    const score = yield contracts.instance.Votes.getRecord(data.commentId);
    return { score: (score[1]).toString(10), commentId: data.commentId };
});

export default { execute, name: 'getScore' };
