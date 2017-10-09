import * as Promise from 'bluebird';
import Auth from './Auth';
import schema from '../utils/jsonschema';

const login = {
    'id': '/login',
    'type': 'object',
    'properties': {
        'ethAddress': { 'type': 'any', 'format': 'address' },
        'password': { 'type': 'any', 'format': 'buffer' },
        'rememberTime': { 'type': 'number' }
    },
    'required': ['account', 'password']
};
const execute = Promise.coroutine(function* (data: AuthLoginRequest) {
    const v = new schema.Validator();
    v.validate(data, login, { throwError: true });

    return Auth.login(data.ethAddress, data.password, data.rememberTime);
});

export default { execute, name: 'login' };
