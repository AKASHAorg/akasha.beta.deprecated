import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import schema from '../utils/jsonschema';

const setPorts = {
    'id': '/setPorts',
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
        'restart': { 'type': 'boolean' }
    },
    'required': ['ports']
};

const execute = Promise.coroutine(function* (data: IpfsSetConfigRequest) {
    const v = new schema.Validator();
    v.validate(data, setPorts, { throwError: true });

    return IpfsConnector.getInstance().setPorts(data.ports, data.restart);
});

export default { execute, name: 'setPorts' };
