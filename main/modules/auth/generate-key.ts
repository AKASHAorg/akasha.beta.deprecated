import * as Promise from 'bluebird';
import Auth from './Auth';
import schema from '../utils/jsonschema';

const generateEthKey = {
    'id': '/generateEthKey',
    'type': 'object',
    'properties': {
        'password': { 'type': 'any', 'format': 'buffer' },
        'password1': { 'type': 'any', 'format': 'buffer' }
    },
    'required': ['password', 'password1']
};
const execute = Promise.coroutine(function* (data: AuthKeygenRequest) {
    const v = new schema.Validator();
    v.validate(data, generateEthKey, { throwError: true });

    if (!(Buffer.from(data.password)).equals(Buffer.from(data.password1))) {
        throw new Error('auth:generate-key:pwdm');
    }
    const address = yield Auth.generateKey(data.password);
    return { address };
});

export default { execute, name: 'generateEthKey' };
