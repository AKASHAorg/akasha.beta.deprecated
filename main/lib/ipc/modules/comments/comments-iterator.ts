import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import getComment from './get-comment';
/**
 * Get entries indexed by tag
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {start?: number, limit?: number, entryId: string, reverse: boolean }) {
    let currentId = (data.start) ? data.start : yield contracts.instance.comments.getFirstComment(data.entryId);
    if (currentId === '0') {
        return { collection: [], entryId: data.entryId };
    }
    let comment;
    const maxResults = (data.limit) ? data.limit : 50;
    const results = [];
    let counter = 0;
    if (!data.start) {
        comment = yield getComment.execute({entryId: data.entryId, commentId: currentId});
        results.push(comment);
        counter = 1;
    }

    while (counter < maxResults) {
        currentId = (data.reverse) ? yield contracts.instance.comments.getPrevComment(data.entryId, currentId) :
            yield contracts.instance.comments.getNextComment(data.entryId, currentId);
        if (currentId === '0') {
            break;
        }
        comment = yield getComment.execute({entryId: data.entryId, commentId: currentId});
        results.push(comment);
        counter++;
    }
    return { collection: results, entryId: data.entryId, limit: maxResults };
});

export default { execute, name: 'commentsIterator' };

