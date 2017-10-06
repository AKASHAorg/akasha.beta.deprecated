import * as Promise from 'bluebird';

const execute = Promise.coroutine(function* () {
    throw new Error('entry:followingStreamIterator is deprecated');
});

export default { execute, name: 'followingStreamIterator' };
