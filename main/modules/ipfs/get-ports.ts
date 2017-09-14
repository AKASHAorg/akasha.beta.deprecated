import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { BASE_URL, generalSettings } from '../../config/settings';

const execute = Promise.coroutine(function* () {
    const ports = yield IpfsConnector.getInstance().getPorts();
    generalSettings.set(BASE_URL, `http://127.0.0.1:${ports.gateway}/ipfs`);
    return {
        apiPort: ports.api,
        gatewayPort: ports.gateway,
        swarmPort: ports.swarm
    };
});

export default { execute, name: 'getPorts' };
