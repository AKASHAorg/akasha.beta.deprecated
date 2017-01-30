import * as Promise from 'bluebird';

const execute = Promise.coroutine(function*(data?: any) {
    return Promise.reject('Not implemented');
});

export default { execute, name: 'query' };
