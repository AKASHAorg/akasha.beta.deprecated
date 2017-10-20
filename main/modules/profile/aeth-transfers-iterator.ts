import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import schema from '../utils/jsonschema';
import contracts from '../../contracts/index';
import { resolveEthAddress } from './helpers';

export const transfersIterator = {
    'id': '/transfersIterator',
    'type': 'object',
    'properties': {
        'ethAddress': {'type': 'string', 'format': 'address'},
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
        'lastIndex': {'type': 'number'}
    },
    'required': ['toBlock', 'ethAddress']
};
/**
 *
 * @type {Function}
 */
const execute = Promise.coroutine(function* (
    data: { token: string, ethAddress: string, limit?: number, toBlock: number, lastIndex?: number, reversed?: boolean }) {

    const v = new schema.Validator();
    v.validate(data, transfersIterator, { throwError: true });

    const maxResults = data.limit || 5;
    const collection = [];
    const fetched = yield contracts
        .fromEvent(contracts.instance.AETH.Transfer, { to: data.ethAddress }, data.toBlock,
            maxResults, { lastIndex: data.lastIndex, reversed: data.reversed || false });

    for (let event of fetched.results) {
        const from = yield resolveEthAddress(event.args.from);

        collection.push({
            from,
            amount: (GethConnector.getInstance().web3.fromWei(event.args.value, 'ether')).toFormat(5),
            blockNumber: event.blockNumber
        });

        if (collection.length === data.limit) {
            break;
        }
    }

    return { collection: collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
});

export default { execute, name: 'transfersIterator' };
