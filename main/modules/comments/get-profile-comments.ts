import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';

/**
 * Get comment ipfs hashes for a profile
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { profileId: string, start?: number, limit?: number }) {
    let commentEthData, entryId, commentId;
    const comments = [];
    let status = yield GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    const maxResults = (data.limit) ? data.limit : 20;

    while (comments.length < maxResults) {
        let filter = {
            profile: data.profileId,
            fromBlock: status - 5000,
            toBlock: status
        };
        let filterData = yield contracts.instance.comments.getByProfile(filter);
        for (let comment of filterData) {
            entryId = comment.args.entryId.toString();
            commentId = comment.args.commentId.toString();
            console.log(comment, entryId, commentId);
            commentEthData = yield contracts.instance.comments.getComment(entryId, commentId);
            comments.push(commentEthData.ipfsHash);
        }
        status -= 5000;
    }

    return { comments: comments };
});

export default { execute, name: 'getProfileComments' };