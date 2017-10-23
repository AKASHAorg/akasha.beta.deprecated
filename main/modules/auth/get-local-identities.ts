import * as Promise from 'bluebird';
import resolveEth from '../registry/resolve-ethaddress';
import { GethConnector } from '@akashaproject/geth-connector';
import { uniq } from 'ramda';

const execute = Promise.coroutine(function* () {
    const accounts = yield GethConnector.getInstance().web3.eth.getAccountsAsync();
    if (!accounts || !accounts.length) {
        return [];
    }
    const profiles = uniq(accounts).map((address: string) => {
        return resolveEth.execute({ ethAddress: address });
    });
    const collection = yield Promise.all(profiles);
    return { collection: collection || [] };
});

export default { execute, name: 'getLocalIdentities' };
