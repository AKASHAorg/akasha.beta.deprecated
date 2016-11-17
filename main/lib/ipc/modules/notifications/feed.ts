import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { filter } from './set-filter';
import { GethConnector } from '@akashaproject/geth-connector';

let entries;
let comments;
let votes;
const eventTypes = {
    VOTE: 'vote',
    COMMENT: 'comment',
    PUBLISH: 'publish'
};
/**
 * Get total number of your follows
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { stop?: boolean }, cb) {
    if (data.stop && entries) {
        entries.stopWatching(() => {
            entries = null;
        });
        comments.stopWatching(() => {
            comments = null;
        });
        votes.stopWatching(() => {
            votes = null;
        });
        return { running: false };
    }

    if (entries) {
        return { running: true, warn: true };
    }

    const filterBlock = { fromBlock: filter.getBlockNr(), toBlock: 'latest' };
    entries = contracts.instance.entries.contract.Publish({}, filterBlock);
    comments = contracts.instance.comments.contract.Commented({}, filterBlock);
    votes = contracts.instance.votes.contract.Vote({}, filterBlock);

    entries.watch((err, entry) => {
        if (filter.hasAddress(entry.args.author)) {
            cb(err, {
                type: eventTypes.PUBLISH,
                profileAddress: entry.args.author,
                entryId: (entry.args.entryId).toString(),
                blockNumber: entry.blockNumber,
                tag: GethConnector.getInstance().web3.toUtf8(entry.args.tag)
            });
        }
    });

    comments.watch((err, comment) => {
        if (filter.hasAddress(comment.args.profile)) {
            cb(err, {
                type: eventTypes.COMMENT,
                profileAddress: comment.args.profile,
                entryId: (comment.args.entryId).toString(),
                blockNumber: comment.blockNumber,
                commentId: (comment.args.commentId).toString()
            });
        }
    });

    votes.watch((err, vote) => {
        if (filter.hasAddress(vote.args.profile)) {
            cb(err, {
                type: eventTypes.VOTE,
                profileAddress: vote.args.profile,
                entryId: (vote.args.entry).toString(),
                blockNumber: vote.blockNumber,
                weight: (vote.args.weight).toNumber()
            });
        }
    });
    return { running: true }
});

export default { execute, name: 'feed' };
