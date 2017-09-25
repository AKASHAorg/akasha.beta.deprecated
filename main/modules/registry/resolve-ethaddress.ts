import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { unpad } from 'ethereumjs-util';
import { GethConnector } from '@akashaproject/geth-connector';

/**
 * Resolve eth address to profile contract address
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileByAddressRequest) {
    let profileHex = yield contracts.instance.ProfileResolver.reverse(data.ethAddress);
    if (!unpad(profileHex)) {
        profileHex = null;
    }
    const akashaId = (profileHex) ? GethConnector.getInstance().web3.toUtf8(profileHex) : null;
    return { ethAddress: data.ethAddress, akashaId };
});

export default { execute, name: 'getByAddress' };
