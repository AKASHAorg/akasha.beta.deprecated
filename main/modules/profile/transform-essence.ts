import * as Promise from 'bluebird';
import schema from '../utils/jsonschema';
import contracts from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';

export const transformEssence = {
    'id': '/transformEssence',
    'type': 'object',
    'properties': {
        'amount': { 'type': 'string' },
        'token': { 'type': 'string' }
    },
    'required': ['amount', 'token']
};
/**
 *
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { amount: string, token: string }, cb) {
    const v = new schema.Validator();
    v.validate(data, transformEssence, { throwError: true });

    const bnAmount = GethConnector.getInstance().web3.toWei(data.amount, 'ether');
    const txData = contracts.instance.Essence.transformEssence.request(bnAmount, { gas: 100000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt };
});

export default { execute, name: 'transformEssence', hasStream: true };
