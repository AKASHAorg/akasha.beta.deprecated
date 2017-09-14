import * as Promise from 'bluebird';
import Auth from './Auth';
import feed from '../notifications/feed';

const execute = Promise.coroutine(function* () {
    feed.execute({ stop: true });
    Auth.logout();
    return { done: true };
});

export default { execute, name: 'logout' };
