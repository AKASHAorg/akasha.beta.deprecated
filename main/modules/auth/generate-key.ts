import * as Promise from 'bluebird';
import Auth from './Auth';

const execute = Promise.coroutine(function*(data: AuthKeygenRequest) {
    const address = yield Auth.generateKey(data.password);
    return { address };
});

export default { execute, name: 'generateEthKey' };