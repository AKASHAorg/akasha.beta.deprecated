import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { GethConnector } from '@akashaproject/geth-connector';

/**
 * Get comments ipfs hashes for a profile
 * @param start {block number}
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { id: string, start?: number, limit?: number }) {
    let commentEthData, entryId, commentId;
    const comments = [];
    let status = (data.start) ? data.start : yield GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    const maxResults = (data.limit) ? data.limit : 20;
    const registerEvent = yield contracts.instance.registry.getRegistered({ index: { id: data.id }, fromBlock: 0 });
    const profile = yield contracts.instance.registry.addressOf(data.id);

    while (comments.length < maxResults && registerEvent[0] && status >= registerEvent[0].blockNumber) {
        let filter = {
            profile: profile,
            fromBlock: status - 5000,
            toBlock: status
        };
        let filterData = yield contracts.instance.comments.getByProfile(filter);
        for (let comment of filterData) {
            entryId = comment.args.entryId.toString();
            commentId = comment.args.commentId.toString();
            commentEthData = yield contracts.instance.comments.getComment(entryId, commentId);
            comments.push(commentEthData.ipfsHash);
        }
        status -= 5000;
    }

    return { comments: comments };
});

export default { execute, name: 'getProfileComments' };