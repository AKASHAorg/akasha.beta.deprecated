import * as Promise from 'bluebird';
import { CORE_MODULE, GETH_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        const gethConnector = getService(CORE_MODULE.GETH_CONNECTOR);
        const blockNr = gethConnector.getInstance().serviceStatus.api ?
            yield gethConnector.getInstance().web3.eth.getBlockNumberAsync() : null;
        return { blockNr };
    });
    const status = { execute, name: 'status' };
    const service = function () {
        return status;
    };
    sp().service(GETH_MODULE.status, service);
    return status;
}
//# sourceMappingURL=status.js.map