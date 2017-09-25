import * as Promise from 'bluebird';

const execute = Promise.coroutine(function* () {
    throw new Error('deprecated');
});

export default { execute, name: 'isSubscribed' };
