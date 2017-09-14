import auth from '../auth/Auth';
import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Remove your profile
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileUnregisterRequest) {
    const txData = yield contracts.instance.registry.unregister(data.akashaId, data.gas);
    const tx = yield auth.signData(txData, data.token);
    return { tx };
});

export default { execute, name: 'unregister' };
