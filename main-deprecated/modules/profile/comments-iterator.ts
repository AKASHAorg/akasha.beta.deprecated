import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';
import schema from '../utils/jsonschema';
import { unpad } from 'ethereumjs-util';


export const commentsIterator = {
    'id': '/commentsIterator',
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
    v.validate(data, commentsIterator, { throwError: true });

    const collection = [];
    const maxResults = data.limit || 5;
    const address = yield profileAddress(data);
    const toBlock = (!data.lastBlock) ? yield GethConnector.getInstance().web3.eth.getBlockNumberAsync() : data.lastBlock;
    const fetched = yield contracts.fromEvent(
        contracts.instance.Comments.Publish,
        { author: address },
        toBlock,
        maxResults,
        { lastIndex: data.lastIndex, reversed: data.reversed || false }
    );

    for (let event of fetched.results) {
        collection.push({
            author: event.args.author,
            entryId: event.args.entryId,
            parent: unpad(event.args.parent),
            commentId: event.args.id
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

export default { execute, name: 'commentsIterator' };

