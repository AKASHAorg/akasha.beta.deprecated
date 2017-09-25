import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Create a new Tag
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: TagCreateRequest, cb) {
    const txData = yield contracts.instance.Tags.add.request(data.tagName);
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, tagName: data.tagName };
});

export default { execute, name: 'create', hasStream: true };
