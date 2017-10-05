import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const canCreate = {
    'id': '/canCreate',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'string', 'format': 'address' }
    },
    'required': ['ethAddress']
};

const execute = Promise.coroutine(function* (data: { ethAddress: string }) {
    const v = new schema.Validator();
    v.validate(data, canCreate, { throwError: true });

    const can = yield contracts.instance.Tags.canCreate(data.ethAddress);
    return { can };
});

export default { execute, name: 'canCreate' };
