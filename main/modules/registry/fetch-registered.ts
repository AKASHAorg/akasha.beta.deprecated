import * as Promise from 'bluebird';
import contracts from '../../contracts/index';


/**
 * Get registered users from contract event `Register`
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: {toBlock: number, limit?: number}) {
    const collection = [];
    const maxResults = data.limit || 5;
    const fetched = yield contracts.fromEvent(contracts.instance.ProfileRegistrar.Register, {}, data.toBlock, maxResults);
    for (let event of fetched.results) {
        collection.push({akashaId: event.args.label});
    }
    return { collection: collection, lastBlock: fetched.fromBlock };
});

export default { execute, name: 'fetchRegistered' };
