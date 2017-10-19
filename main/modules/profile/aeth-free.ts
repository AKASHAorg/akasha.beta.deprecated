import * as Promise from 'bluebird';
import schema from '../utils/jsonschema';
import contracts from '../../contracts/index';

export const freeAeth = {
    'id': '/freeAeth',
    'type': 'object',
    'properties': {
        'token': { 'type': 'string' }
    },
    'required': ['token']
};
/**
 *
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { token: string }, cb) {
    const v = new schema.Validator();
    v.validate(data, freeAeth, { throwError: true });

    const txData = contracts.instance.AETH.freeAeth.request({ gas: 100000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt };
});

export default { execute, name: 'freeAeth', hasStream: true };
