import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';

/**
 * Get comments ipfs hashes for a profile
 * @param start {block number}
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { id: string, start?: number, limit?: number }) {
    let commentEthData, entryId, commentId;
    const comments = [];
    let status = (data.start) ? data.start : yield GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    const maxResults = (data.limit) ? data.limit : 30;
    const profile = yield contracts.instance.registry.addressOf(data.id);
    const blockStep = 50000;

    while (comments.length < maxResults && status > 0) {
        let filter = {
            profile: profile,
            fromBlock: (status - blockStep < 0) ? 0 : status - blockStep,
            toBlock: status
        };
        let filterData = yield contracts.instance.comments.getByProfile(filter);
        for (let comment of filterData) {
            entryId = comment.args.entryId.toString();
            commentId = comment.args.commentId.toString();
            commentEthData = yield contracts.instance.comments.getComment(entryId, commentId);
            comments.push(commentEthData.ipfsHash);
        }
        status -= blockStep;
    }

    return { comments: comments };
});

export default { execute, name: 'getProfileComments' };
