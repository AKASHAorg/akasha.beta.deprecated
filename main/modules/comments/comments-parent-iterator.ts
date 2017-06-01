import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import getComment from './get-comment';

/**
 * Resolve parent comments and send tree structure of comments
 * @type {Function}
 */

const execute = Promise.coroutine(function*(data: { start?: number, limit?: number, entryId: string }) {
    let currentId = yield contracts.instance.comments.getFirstComment(data.entryId);
    let firstCommentId = currentId;
    if (currentId === '0') {
        return { collection: [], entryId: data.entryId };
    }
    let comment, commentContract;
    const maxResults = (data.limit) ? data.limit : 50;
    let start = (data.start) ? data.start : 0;
    let results = [];
    let comments = [];
    let commentTree = [];
    let counter = 0;

    while (currentId !== '1') {
        currentId = yield contracts.instance.comments.getNextComment(data.entryId, currentId);
        if (!comments.length) {
            currentId = firstCommentId;
        }
        commentContract = yield contracts.instance.comments.getComment(data.entryId, currentId);
        comments.push(commentContract);
    }
    commentTree = listToTree(comments);
    const commentTreeLn = commentTree.length;

    while (counter < maxResults && start < commentTreeLn) {
        comment = yield getComment.execute({ entryId: data.entryId, commentId: commentTree[start].idComment });
        results.push(comment);
        counter++;
        start++;
    }


    function listToTree(comments: CommentContract[]) {
        let treeList = [];
        let lookup = {};
        comments.forEach((comment: CommentContract) => {
            lookup[comment['idComment']] = comment;
            comment['children'] = [];
        });
        comments.forEach((comment: CommentContract) => {
            if (comment['parent'] !== '0') {
                lookup[comment['parent']]['children'].push(comment);
            } else {
                treeList.push(comment);
            }
        });
        return treeList;
    }

    interface CommentContract {
        idComment: string;
        parent: string;
        profile: string;
        ipfsHash: string;
        active: boolean;
        unixStamp: number;
        children?: any[];
    }

    return { collection: results, entryId: data.entryId, limit: maxResults, comments: commentTree };
});

export default { execute, name: 'commentsParentIterator' };