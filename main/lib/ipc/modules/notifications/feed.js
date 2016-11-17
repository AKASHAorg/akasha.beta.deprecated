"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const set_filter_1 = require('./set-filter');
const geth_connector_1 = require('@akashaproject/geth-connector');
let entries;
let comments;
let votes;
const eventTypes = {
    VOTE: 'vote',
    COMMENT: 'comment',
    PUBLISH: 'publish'
};
const execute = Promise.coroutine(function* (data, cb) {
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
    const filterBlock = { fromBlock: set_filter_1.filter.getBlockNr(), toBlock: 'latest' };
    entries = index_1.constructed.instance.entries.contract.Publish({}, filterBlock);
    comments = index_1.constructed.instance.comments.contract.Commented({}, filterBlock);
    votes = index_1.constructed.instance.votes.contract.Vote({}, filterBlock);
    entries.watch((err, entry) => {
        if (set_filter_1.filter.hasAddress(entry.args.author)) {
            cb(err, {
                type: eventTypes.PUBLISH,
                profileAddress: entry.args.author,
                entryId: (entry.args.entryId).toString(),
                blockNumber: entry.blockNumber,
                tag: geth_connector_1.GethConnector.getInstance().web3.toUtf8(entry.args.tag)
            });
        }
    });
    comments.watch((err, comment) => {
        if (set_filter_1.filter.hasAddress(comment.args.profile)) {
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
        if (set_filter_1.filter.hasAddress(vote.args.profile)) {
            cb(err, {
                type: eventTypes.VOTE,
                profileAddress: vote.args.profile,
                entryId: (vote.args.entry).toString(),
                blockNumber: vote.blockNumber,
                weight: (vote.args.weight).toNumber()
            });
        }
    });
    return { running: true };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'feed' };
//# sourceMappingURL=feed.js.map