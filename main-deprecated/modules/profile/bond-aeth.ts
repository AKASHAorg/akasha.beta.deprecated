import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import schema from '../utils/jsonschema';
import contracts from '../../contracts/index';

export const bondAeth = {
    'id': '/bondAeth',
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
    v.validate(data, bondAeth, { throwError: true });

    const bnAmount = GethConnector.getInstance().web3.toWei(data.amount, 'ether');
    const txData = contracts.instance.AETH.bondAeth.request(bnAmount, { gas: 100000 });
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt };
});

export default { execute, name: 'bondAeth', hasStream: true };
