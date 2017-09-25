import { create } from '../profile/ipfs';
import { decodeHash } from '../ipfs/helpers';
import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Register a new AKASHA ID
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileCreateRequest, cb) {
    const ipfsHash = yield create(data.ipfs);
    const [fn, digest, hash] = decodeHash(ipfsHash);
    const txData = yield contracts.instance
        .ProfileRegistrar
        .register.request(data.akashaId, data.donations, hash, fn, digest, { gas: 400000, from: data.ethAddress});
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx };
});

export default { execute, name: 'registerProfile', hasStream: true };
