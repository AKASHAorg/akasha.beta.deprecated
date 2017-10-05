import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';
import schema from '../utils/jsonschema';

export const fetchRegistered = {
    'id': '/fetchRegistered',
    'type': 'object',
    'properties': {
        'toBlock': { 'type': 'number'},
        'limit': { 'type': 'number'}
    },
    'required': ['toBlock']
};
/**
 * Get registered users from contract event `Register`
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: {toBlock: number, limit?: number}) {
    const v = new schema.Validator();
    v.validate(data, fetchRegistered, { throwError: true });

    const collection = [];
    const maxResults = data.limit || 5;
    const fetched = yield contracts.fromEvent(contracts.instance.ProfileRegistrar.Register, {}, data.toBlock, maxResults);
    for (let event of fetched.results) {
        collection.push({ akashaId: GethConnector.getInstance().web3.toUtf8(event.args.label) });
    }
    return { collection: collection, lastBlock: fetched.fromBlock };
});

export default { execute, name: 'fetchRegistered' };
