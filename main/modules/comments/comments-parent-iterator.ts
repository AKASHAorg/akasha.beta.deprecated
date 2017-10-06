import * as Promise from 'bluebird';
/**
 * Resolve parent comments and send tree structure of comments
 * @type {Function}
 */
const execute = Promise.coroutine(function* () {
    throw new Error('commentsParentIterator:deprecated, use default iterator');
});

export default { execute, name: 'commentsParentIterator' };
