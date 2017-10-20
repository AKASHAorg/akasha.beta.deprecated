import * as Promise from 'bluebird';
import getEntry, { getEntry as getEntrySchema } from './get-entry';
import schema from '../utils/jsonschema';

export const getEntryList = {
    'id': '/getEntryList',
    'type': 'array',
    'items': {
        '$ref': '/getEntry'
    },
    'uniqueItems': true,
    'minItems': 1
};
/**
 * Resolve a list of entries
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: EntryGetRequest[], cb) {
    const v = new schema.Validator();
    v.addSchema(getEntrySchema, '/getEntry');
    v.validate(data, getEntryList, { throwError: true });

    for (let entryObj of data) {
        getEntry.execute(entryObj).then((result) => cb('',
            { data: result, entryId: entryObj.entryId, ethAddress: entryObj.ethAddress, akashaId:  entryObj.akashaId }
            ));
    }
    return {};
});

export default { execute, name: 'getEntryList', hasStream: true };
