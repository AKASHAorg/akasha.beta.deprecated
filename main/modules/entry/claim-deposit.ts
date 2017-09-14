import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import auth from '../auth/Auth';

/**
 * Claim deposit from entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { entryId: string, token: string, gas: number }) {
    const txData = yield contracts.instance.entries.claimDeposit(data.entryId, data.gas);
    const tx = yield auth.signData(txData, data.token);
    return { tx, entryId: data.entryId };
});

export default { execute, name: 'claim' };
