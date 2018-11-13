import * as Promise from 'bluebird';
import { SEARCH_MODULE } from '@akashaproject/common/constants';
import { dbs } from './indexes';
export default function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data, cb) {
        const collection = [];
        const pageSize = data.limit || 10;
        const options = {
            beginsWith: data.text,
            field: 'akashaId',
            threshold: 1,
            limit: pageSize,
            type: 'ID',
        };
        dbs.profiles.searchIndex.match(options)
            .on('data', (data) => {
            collection.push({ akashaId: data.token, ethAddress: data.documents[0] });
        })
            .on('end', () => {
            cb('', { collection });
        });
        return {};
    });
    const findProfiles = { execute, name: 'findProfiles', hasStream: true };
    const service = function () {
        return findProfiles;
    };
    sp().service(SEARCH_MODULE.findProfiles, service);
    return findProfiles;
}
//# sourceMappingURL=find-profiles.js.map