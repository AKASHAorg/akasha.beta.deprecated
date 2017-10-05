import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import schema from '../utils/jsonschema';

const startService = {
    'id': '/startService',
    'type': 'object',
    'properties': {
        'ports': {
            'type': 'object',
            'properties': {
                'gateway': { 'type': 'number' },
                'api': { 'type': 'number' },
                'swarm': { 'type': 'number' }
            }
        },
        'storagePath': { 'type': 'string' }
    },
};

const execute = Promise.coroutine(function* (data: IpfsStartRequest) {
    const v = new schema.Validator();
    v.validate(data, startService, { throwError: true });

    if (IpfsConnector.getInstance().serviceStatus.process) {
        throw new Error('IPFS is already running');
    }
    if (data.storagePath) {
        IpfsConnector.getInstance().setIpfsFolder(data.storagePath);
    }
    IpfsConnector.getInstance().enableDownloadEvents();
    yield IpfsConnector.getInstance().start();
    return {};
});

export default { execute, name: 'startService' };
