import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';
import {unpad, addHexPrefix} from 'ethereumjs-util';
import schema from '../utils/jsonschema';


export const essenceIterator = {
    'id': '/essenceIterator',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'akashaId': { 'type': 'string' },
        'lastBlock': { 'type': 'number' },
        'lastIndex': {'type': 'number'},
        'limit': { 'type': 'number' },
        'reversed': {'type': 'boolean'}
    },
    'required': ['lastBlock']
};

const execute = Promise.coroutine(function* (data: {
    lastBlock?: number, limit?: number,
    akashaId?: string, ethAddress?: string, lastIndex?: number, reversed?: boolean
}) {
    const v = new schema.Validator();
    v.validate(data, essenceIterator, { throwError: true });

    const collection = [];
    const maxResults = data.limit || 5;
    const address = yield profileAddress(data);
    const toBlock = (!data.lastBlock) ? yield GethConnector.getInstance().web3.eth.getBlockNumberAsync() : data.lastBlock;
    const fetched = yield contracts.fromEvent(
        contracts.instance.Essence.CollectEssence,
        { receiver: address },
        toBlock,
        maxResults,
        { lastIndex: data.lastIndex, reversed: data.reversed || false }
    );

    for (let event of fetched.results) {
        collection.push({
            amount: (GethConnector.getInstance().web3.fromWei(event.args.amount, 'ether')).toFormat(5),
            action: GethConnector.getInstance().web3.toUtf8(addHexPrefix(unpad(event.args.action))),
            sourceId: event.args.source,
            blockNumber: event.blockNumber
        });
    }
    return {
        collection: collection,
        lastBlock: fetched.fromBlock,
        lastIndex: fetched.lastIndex,
        akashaId: data.akashaId,
        limit: maxResults
    };
});

export default { execute, name: 'essenceIterator' };

