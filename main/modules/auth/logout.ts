import * as Promise from 'bluebird';
import Auth from './Auth';

const execute = Promise.coroutine(function* () {

    Auth.logout();
    return { done: true };
});

export default { execute, name: 'logout' };
