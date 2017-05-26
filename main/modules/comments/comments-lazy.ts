import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import getComment from './get-comment';

/**
 * Resolve parent comments and send tree structure of comments
 * @type {Function}
 */

const execute = Promise.coroutine(function*(data: { start?: number, limit?: number, entryId: string }) {
    let currentId = (data.start) ? data.start : yield contracts.instance.comments.getFirstComment(data.entryId);
    let firstCommentId = currentId;
    let counter = 0;
    const maxResults = (data.limit) ? data.limit : 5;
    let comment, content, commentContract, commentInfo, reply, replyInfo;
    let parents = [];
    let commentContracts = [];
    let missingReplies = [];
    let finishedReplies = [];
    let firstTime = true;

    if (currentId === '0') {
        return { collection: [], entryId: data.entryId };
    }

    while (counter < maxResults) {
        currentId = yield contracts.instance.comments.getNextComment(data.entryId, currentId);
        if (firstTime) {
            currentId = firstCommentId;
            firstTime = false;
        }
        if (currentId === '0') {
            break;
        }
        commentContract = yield contracts.instance.comments.getComment(data.entryId, currentId);
        commentContracts.push(commentContract);
        if (commentContract.parent === '0') {
            comment = yield getComment.execute({ entryId: data.entryId, commentId: commentContract.idComment });
            content = JSON.parse(comment.data.content).blocks[0]['text'];
            commentInfo = { commentId: comment.commentId, parentId: comment.data.parent, text: content };
            parents.push(commentInfo);
            counter++;
        }
    }

    commentContracts.reverse();
    for (let parentIndex in parents) {
        parents[parentIndex].replies = [];
        for (let commentContract of commentContracts) {
            if (commentContract.parent === parents[parentIndex].commentId) {
                reply = yield getComment.execute({ entryId: data.entryId, commentId: commentContract.idComment });
                content = JSON.parse(reply.data.content).blocks[0]['text'];
                replyInfo = { commentId: reply.commentId, parentId: reply.data.parent, text: content };
                if (parents[parentIndex].replies.length < 3) {
                        parents[parentIndex].replies.push(replyInfo);
                    } else if (parents[parentIndex].replies.length === 3) {
                        parents[parentIndex].more = true;
                    }
            }
        }
        if (data.start && parents[parentIndex].replies.length < 3) {
            missingReplies.push(parentIndex);
        }
    }

    if (missingReplies.length) {
        currentId = firstCommentId;
        while (missingReplies.length !== finishedReplies.length) {
            currentId = yield contracts.instance.comments.getPrevComment(data.entryId, currentId);
            if (currentId === '0') {
                break;
            }
            commentContract = yield contracts.instance.comments.getComment(data.entryId, currentId);
            for (let parentIndex of missingReplies) {
                if (commentContract.parent === parents[parentIndex].commentId) {
                    reply = yield getComment.execute({ entryId: data.entryId, commentId: commentContract.idComment });
                    content = JSON.parse(reply.data.content).blocks[0]['text'];
                    replyInfo = { commentId: reply.commentId, parentId: reply.data.parent, text: content };
                    if (parents[parentIndex].replies.length < 3) {
                        parents[parentIndex].replies.push(replyInfo);
                    } else if (parents[parentIndex].replies.length === 3) {
                        finishedReplies.push(parentIndex);
                        parents[parentIndex].more = true;
                    }
                }
            }
        }
    }


    return { collection: parents, entryId: data.entryId, limit: maxResults };
});

export default { execute, name: 'commentsLazy' };