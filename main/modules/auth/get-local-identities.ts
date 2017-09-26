import * as Promise from 'bluebird';
import resolveEth from '../registry/resolve-ethaddress';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function* () {
    const accounts = yield GethConnector.getInstance().web3.eth.getAccountsAsync();
    if (!accounts || !accounts.length) {
        return [];
    }
    const profiles = accounts.map((address) => {
        return resolveEth.execute({ ethAddress: address });
    });
    const collection = yield Promise.all(profiles);
    return { collection };
});

export default { execute, name: 'getLocalIdentities' };
