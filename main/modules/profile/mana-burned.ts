import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import schema from '../utils/jsonschema';
import contracts from '../../contracts/index';
import { profileAddress } from './helpers';

export const manaBurned = {
    'id': '/manaBurned',
    'type': 'object',
    'properties': {
        'akashaId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' }
    }
};
/**
 *
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { akashaId?: string, ethAddress?: string }) {
    const v = new schema.Validator();
    v.validate(data, manaBurned, { throwError: true });
    const address = yield profileAddress(data);
    const totalEntries = yield contracts.instance.Entries.getEntryCount(address);
    const entryCost = yield contracts.instance.Entries.required_essence();
    const totalEntriesMana = entryCost.times(totalEntries);

    const totalComments = yield contracts.instance.Comments.totalCommentsOf(address);
    const commentCost = yield contracts.instance.Comments.required_essence();
    const totalCommentsMana = commentCost.times(totalComments);

    const totalVotes = yield contracts.instance.Votes.totalVotesOf(address);
    const voteCost = yield contracts.instance.Votes.required_essence();
    const votesMana = voteCost.times(totalVotes);

    return {
        entries: {
            totalEntries: totalEntries.toNumber(),
            manaCost: (GethConnector.getInstance().web3.fromWei(totalEntriesMana, 'ether')).toFormat(5)
        },
        comments: {
            totalComments: totalComments.toNumber(),
            manaCost: (GethConnector.getInstance().web3.fromWei(totalCommentsMana, 'ether')).toFormat(5)
        },
        votes: {
            totalVotes: totalVotes.toNumber(),
            manaCost: (GethConnector.getInstance().web3.fromWei(votesMana, 'ether')).toFormat(5)
        }
    };
});

export default { execute, name: 'manaBurned'};
