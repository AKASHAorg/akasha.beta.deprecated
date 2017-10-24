import * as Promise from 'bluebird';
import { dbs } from './indexes';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { GethConnector } from '@akashaproject/geth-connector';

export const syncTags = {
    'id': '/syncTags',
    'type': 'object',
    'properties': {
        'fromBlock': {'type': 'number'}
    },
    'required': ['fromBlock']
};


const execute = Promise.coroutine(function* (data: { fromBlock: number }, cb) {
    const v = new schema.Validator();
    v.validate(data, syncTags, { throwError: true });

    const fetched = yield contracts.fromEvent(contracts.instance.Tags.TagCreate, {}, data.fromBlock,
            10000, { lastIndex: 0, reversed: true });
    const toUtf8 = GethConnector.getInstance().web3.toUtf8;
    const tagDocs = fetched.results.map((event) => {
       return { id: event.args.tag, tagName: toUtf8(event.args.tag) };
    });
    dbs.tags
        .searchIndex
        .concurrentAdd({}, tagDocs, (err) => { if (err) { return cb(err); } cb('', { lastBlock: fetched.fromBlock, done: true }); });
    return { done: false };
});

export default { execute, name: 'syncTags', hasStream: true };
