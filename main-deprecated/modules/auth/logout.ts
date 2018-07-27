import * as Promise from 'bluebird';
import Auth from './Auth';
import contracts from '../../contracts/index';
import subscribe from '../notifications/subscribe';

const execute = Promise.coroutine(function* () {
    yield contracts.stopAllWatchers();
    yield subscribe.execute(
        {
            settings: { feed: false, donations: false, comments: false, votes: false },
            profile: {}, fromBlock: 0
        }, () => {
        });
    Auth.logout();
    return { done: true };
});

export default { execute, name: 'logout' };
