import * as Promise from 'bluebird';
import schema from '../utils/jsonschema';
import contracts from '../../contracts/index';
import { profileAddress } from '../profile/helpers';
import { GethConnector } from '@akashaproject/geth-connector';
import resolve from '../registry/resolve-ethaddress';

const followingStreamIterator = {
    'id': '/followingStreamIterator',
    'type': 'object',
    'properties': {
        'limit': { 'type': 'number' },
        'toBlock': { 'type': 'number' },
        'akashaId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'lastIndex': { 'type': 'number' },
        'reversed' : {'type': 'boolean'}
    },
    'required': ['toBlock']
};

const execute = Promise.coroutine(function* (data: {
    toBlock: number, limit?: number,
    lastIndex?: number, ethAddress?: string, akashaId?: string, reversed?: boolean
}) {
    const v = new schema.Validator();
    v.validate(data, followingStreamIterator, { throwError: true });

    const address = yield profileAddress(data);

    const fetchedFollow = yield contracts.fromEvent(contracts.instance.Feed.Follow,
        { follower: address }, 0, 1000, { reversed: true });

    const followList = fetchedFollow.results.map((res) => {
        return res.args.followed;
    });
    const aditionalFilter = function (rawData) {
        return followList.includes(rawData.args.author);
    };
    const collection = [];
    const maxResults = data.limit || 5;
    const fetched = yield contracts
        .fromEventFilter(contracts.instance.Entries.Publish, {}, data.toBlock,
            maxResults, { lastIndex: data.lastIndex, reversed: data.reversed || false  }, aditionalFilter);
    for (let event of fetched.results) {

        const captureIndex = yield contracts
            .fromEvent(contracts.instance.Entries.TagIndex, { entryId: event.args.entryId },
                data.toBlock, 10, {});

        const tags = captureIndex.results.map(function (ev) {
            return GethConnector.getInstance().web3.toUtf8(ev.args.tagName);
        });
        const author = yield resolve.execute({ ethAddress: event.args.author });

        collection.push({
            entryType: captureIndex.results.length ? captureIndex.results[0].args.entryType.toNumber() : -1,
            entryId: event.args.entryId,
            tags,
            author
        });
        if (collection.length === maxResults) {
            break;
        }
    }

    return { collection: collection, lastBlock: fetched.fromBlock, lastIndex: fetched.lastIndex };
});

export default { execute, name: 'followingStreamIterator' };
