import * as Promise from 'bluebird';
import Auth from './Auth';
import contracts from '../../contracts/index';

const execute = Promise.coroutine(function* () {
    yield contracts.stopAllWatchers();
    Auth.logout();
    return { done: true };
});

export default { execute, name: 'logout' };
