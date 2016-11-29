import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Resolve akashaId to a contract address
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: ProfileExistsRequest) {
    const profileAddress = yield contracts.instance.registry.addressOf(data.akashaId);
    return { profileAddress, akashaId: data.akashaId };
});

export default { execute, name: 'addressOf' };

