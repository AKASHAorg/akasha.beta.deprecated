import * as Promise from 'bluebird';
import { getEntry as getEntrySchema } from './get-entry';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';
export const getEntryListS = {
    id: '/getEntryList',
    type: 'array',
    items: {
        $ref: '/getEntry',
    },
    uniqueItems: true,
    minItems: 1,
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.addSchema(getEntrySchema, '/getEntry');
        v.validate(data, getEntryListS, { throwError: true });
        const getEntry = getService(ENTRY_MODULE.getEntry);
        for (const entryObj of data) {
            getEntry.execute(entryObj).then((result) => cb('', {
                data: result,
                entryId: entryObj.entryId,
                ethAddress: entryObj.ethAddress,
                akashaId: entryObj.akashaId,
            }));
        }
        return {};
    });
    const getEntryList = { execute, name: 'getEntryList', hasStream: true };
    const service = function () {
        return getEntryList;
    };
    sp().service(ENTRY_MODULE.getEntryList, service);
    return getEntryList;
}
//# sourceMappingURL=get-entry-list.js.map