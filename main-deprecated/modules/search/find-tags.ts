import * as Promise from 'bluebird';
import { dbs } from './indexes';
import GethConnector from '@akashaproject/geth-connector/lib/GethConnector';

const execute = Promise.coroutine(function* (data: { text: string, limit: number }, cb) {
    const collection = new Set();
    const pageSize = data.limit || 10;
    const options = {
        beginsWith: GethConnector.getInstance().web3.fromUtf8(data.text),
        field: 'tagName',
        threshold: 1,
        limit: pageSize,
        type: 'simple'
    };
    dbs.tags.searchIndex.match(options)
        .on('data', (data) => {
            collection.add(GethConnector.getInstance().web3.toUtf8(data));
        })
        .on('end', () => { cb('', { collection: Array.from(collection)});
    });
    return {};
});

export default { execute, name: 'findTags', hasStream: true };
