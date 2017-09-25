import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Check if format is ok
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileExistsRequest) {
    const idValid = yield contracts.instance.ProfileRegistrar.checkFormat(data.akashaId);
    return { idValid, akashaId: data.akashaId };
});

export default { execute, name: 'checkIdFormat' };

