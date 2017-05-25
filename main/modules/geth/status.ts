import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function*() {
    const blockNr = GethConnector.getInstance().serviceStatus.api ?
        yield GethConnector.getInstance().web3.eth.getBlockNumberAsync() : false;
    return { blockNr };
});

export default { execute, name: 'status' };
