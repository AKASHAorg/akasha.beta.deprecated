import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import schema from '../utils/jsonschema';

const startService = {
    'id': '/startService',
    'type': 'object',
    'properties': {
        'datadir': { 'type': 'string' },
        'ipcpath': { 'type': 'string' },
        'cache': { 'type': 'number' }
    }
};

const execute = Promise.coroutine(function* (data: GethStartRequest) {
    const v = new schema.Validator();
    v.validate(data, startService, { throwError: true });

    if (GethConnector.getInstance().serviceStatus.process) {
        throw new Error('Geth is already running');
    }
    GethConnector.getInstance().setOptions(data);
    GethConnector.getInstance().enableDownloadEvents();
    // start daemon
    yield GethConnector.getInstance().start();
    return {};
});

export default { execute, name: 'startService' };
