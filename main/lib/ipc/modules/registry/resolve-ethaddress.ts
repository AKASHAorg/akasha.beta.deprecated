import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Resolve eth address to profile contract address
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: ProfileByAddressRequest) {
    const profileAddress = yield contracts.instance.registry.getByAddress(data.ethAddress);
    return { profileAddress };
});

export default { execute, name: 'getByAddress' };
