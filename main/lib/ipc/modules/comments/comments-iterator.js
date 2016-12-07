"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const get_comment_1 = require('./get-comment');
const execute = Promise.coroutine(function* (data) {
    let currentId = (data.start) ? data.start : yield index_1.constructed.instance.comments.getFirstComment(data.entryId);
    if (currentId === '0') {
        return { collection: [], entryId: data.entryId };
    }
    let comment;
    const maxResults = (data.limit) ? data.limit : 50;
    const results = [];
    let counter = 0;
    if (!data.start) {
        comment = yield get_comment_1.default.execute({ entryId: data.entryId, commentId: currentId });
        results.push({ commentId: currentId, content: comment });
        counter = 1;
    }
    while (counter < maxResults) {
        currentId = (data.reverse) ? yield index_1.constructed.instance.comments.getPrevComment(data.entryId, currentId) :
            yield index_1.constructed.instance.comments.getNextComment(data.entryId, currentId);
        if (currentId === '0') {
            break;
        }
        comment = yield get_comment_1.default.execute({ entryId: data.entryId, commentId: currentId });
        results.push({ commentId: currentId, content: comment });
        counter++;
    }
    return { collection: results, entryId: data.entryId, limit: maxResults };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'commentsIterator' };
//# sourceMappingURL=comments-iterator.js.map