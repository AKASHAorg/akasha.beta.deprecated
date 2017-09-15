import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';
import { unpad } from 'ethereumjs-util';

const execute = Promise.coroutine(function* () {
    const accounts = yield GethConnector.getInstance().web3.eth.getAccountsAsync();
    if (!accounts || !accounts.length) {
        return [];
    }
    const profiles = accounts.map((address) => {
        return contracts.instance.ProfileResolver.reverse(address).then((node) => {
            return {
                akashaId: GethConnector.getInstance().web3.toUtf8(node),
                key: address,
                raw: (unpad(node)) ? node : null
            };
        });
    });
    const collection = yield Promise.all(profiles);
    return { collection };
});

export default { execute, name: 'getLocalIdentities' };
