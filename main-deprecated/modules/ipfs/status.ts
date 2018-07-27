import * as Promise from 'bluebird';

const execute = Promise.coroutine(function* () {
    return {};
});

export default { execute, name: 'status' };
