import * as Promise from 'bluebird';
import { dbs } from './indexes';

const execute = Promise.coroutine(function* (data: { text: string, pageSize: number, offset: number }, cb) {
    const collection = [];
    const pageSize = data.pageSize || 20;
    const offset = data.offset || 0;
    const query = [{ AND: { 'title': [data.text] }, BOOST: 5 }, { AND: { 'excerpt': [data.text] } }];

    dbs.entry.searchIndex.totalHits({ query: query }, function (err, count) {
        dbs.entry.searchIndex.search({
            query: query,
            pageSize: pageSize,
            offset: offset
        })
            .on('data', (data) => {
                collection.push({ entryId: data.document.id, ethAddress: data.document.ethAddress });
            }).on('end', () => {
            cb('', { collection, totalHits: count, searching: false });
        });
    });
    return { searching: true };
});

export default { execute, name: 'query', hasStream: true };
