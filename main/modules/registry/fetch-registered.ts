import * as Promise from 'bluebird';
import contracts from '../../contracts/index';


/**
 * Get registered users from contract event `Register`
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileRegisteredEventRequest) {
    const collection = yield contracts.instance.registry.getRegistered(data);
    return { collection };
});

export default { execute, name: 'fetchRegistered' };
