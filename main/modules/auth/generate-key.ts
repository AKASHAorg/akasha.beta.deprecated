import * as Promise from 'bluebird';
import Auth from './Auth';

const execute = Promise.coroutine(function* (data: AuthKeygenRequest) {
    if (!(Buffer.from(data.password)).equals(Buffer.from(data.password1))) {
        throw new Error('auth:generate-key:pwdm');
    }
    const address = yield Auth.generateKey(data.password);
    return { address };
});

export default { execute, name: 'generateEthKey' };
