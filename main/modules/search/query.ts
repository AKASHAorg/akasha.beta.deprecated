import * as Promise from 'bluebird';
import { dbs } from './indexes';

const execute = Promise.coroutine(function* (data: { text: string, pageSize: number, offset: number }, cb) {
    const collection = [];
    const pageSize = data.pageSize || 20;
    const offset = data.offset || 0;

    dbs.entry.searchIndex.totalHits({ query: [{ AND: { '*': [data.text] } }] }, function (err, count) {
        dbs.entry.searchIndex.search({
            query: [{ AND: { '*': [data.text] } }],
            pageSize: pageSize,
            offset: offset
        })
            .on('data', (data) => {
                collection.push({entryId: data.document.id, ethAddress: data.document.ethAddress});
            }).on('end', () => {
                cb('', {collection, totalHits: count, searching: false});
        });
    });

    return {searching: true};
});

export default { execute, name: 'query', hasStream: true };
