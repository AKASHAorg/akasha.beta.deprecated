import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import schema from '../utils/jsonschema';

const restartService = {
    'id': '/restartService',
    'type': 'object',
    'properties': {
        'timer': { 'type': 'number' }
    },
    'required': ['timer']
};

const execute = Promise.coroutine(function* (data: GethRestartRequest) {
    const v = new schema.Validator();
    v.validate(data, restartService, { throwError: true });

    return GethConnector.getInstance().restart(data.timer);
});

export default { execute, name: 'restartService' };
