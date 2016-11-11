import { module as userModule } from '../auth/index';
import { create } from '../profile/ipfs';
import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Register a new AKASHA ID
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: ProfileCreateRequest) {
    const ipfsHash = yield create(data.ipfs);
    const txData = yield contracts.instance.registry.register(data.akashaId, ipfsHash, data.gas);
    const tx = yield userModule.auth.signData(txData, data.token);
    return { tx };
});

export default { execute, name: 'registerProfile' };
