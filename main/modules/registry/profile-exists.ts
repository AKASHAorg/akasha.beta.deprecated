import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { unpad } from 'ethereumjs-util';

/**
 * Check if provided `akashaId` is taken
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileExistsRequest) {
    const exists = yield contracts.instance.ProfileResolver.addr(data.akashaId);
    const idValid = yield contracts.instance.ProfileRegistrar.checkFormat(data.akashaId);
    return { exists: !!unpad(exists), idValid, akashaId: data.akashaId };
});

export default { execute, name: 'profileExists' };

