import * as Promise from 'bluebird';
import Auth from './Auth';

const execute = Promise.coroutine(function* (data: AuthLoginRequest) {
    return Auth.login(data.account, data.password, data.rememberTime, data.registering);
});

export default { execute, name: 'login' };
