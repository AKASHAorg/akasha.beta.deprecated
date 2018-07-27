import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { profileAddress } from '../profile/helpers';
import schema from '../utils/jsonschema';

const getProfileEntriesCount = {
    'id': '/getProfileEntriesCount',
    'type': 'object',
    'properties': {
        'akashaId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
    }
};

/**
 * Get total number of entries posted by profile
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: {ethAddress?: string, akashaId?: string}) {
    const v = new schema.Validator();
    v.validate(data, getProfileEntriesCount, { throwError: true });

    const address = yield profileAddress(data);
    const count = yield contracts.instance.Entries.getEntryCount(address);
    return { count:  count.toString(10)};
});

export default { execute, name: 'getProfileEntriesCount' };
