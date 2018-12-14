import * as Promise from 'bluebird';
import { dbs } from './indexes';

const execute = Promise.coroutine(function* (data: { text: string, limit: number }, cb) {
    const collection = [];
    const pageSize = data.limit || 10;
    const options = {
        beginsWith: data.text,
        field: 'akashaId',
        threshold: 1,
        limit: pageSize,
        type: 'ID'
    };
    dbs.profiles.searchIndex.match(options)
        .on('data', (data) => {
           collection.push({akashaId: data.token, ethAddress: data.documents[0]});
        })
        .on('end', () => { cb('', { collection});
        });
    return {};
});

export default { execute, name: 'findProfiles', hasStream: true };
