import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get total number of comments for an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { entryId: string}) {
    const count = yield contracts.instance.comments.getCommentsCount(data.entryId);
    return { count, entryId: data.entryId };
});

export default { execute, name: 'commentsCount'};
