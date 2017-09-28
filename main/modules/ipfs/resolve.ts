import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import schema from '../utils/jsonschema';

const resolve = {
    'id': '/resolve',
    'type': 'object',
    'properties': {
        'hash': { 'type': 'string', 'format': 'multihash' }
    },
    'required': ['hash']
};

const execute = Promise.coroutine(function* (data: IpfsResolveRequest) {
    const v = new schema.Validator();
    v.validate(data, resolve, { throwError: true });

    return IpfsConnector.getInstance().api.get(data.hash);
});

export default { execute, name: 'resolve' };
