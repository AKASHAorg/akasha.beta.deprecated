import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function*() {
    const blockNr = yield GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    return { blockNr };
});

export default { execute, name: 'status' };