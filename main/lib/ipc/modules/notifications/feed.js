"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const set_filter_1 = require('./set-filter');
const geth_connector_1 = require('@akashaproject/geth-connector');
const profile_data_1 = require('../profile/profile-data');
let entries;
let comments;
let votes;
const eventTypes = {
    VOTE: 'vote',
    COMMENT: 'comment',
    PUBLISH: 'publish'
};
const hydrateWithProfile = (cb, profile, extra) => {
    profile_data_1.default
        .execute({ profile: profile })
        .then((authorData) => {
        cb('', Object.assign(extra, { author: authorData }));
    })
        .catch((error) => {
        cb({ message: error.message }, extra);
    });
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
        if (err) {
            cb({ message: err.message, type: eventTypes.PUBLISH });
        }
        if (set_filter_1.filter.hasAddress(entry.args.author)) {
            hydrateWithProfile(cb, entry.args.author, {
                type: eventTypes.PUBLISH,
                profileAddress: entry.args.author,
                entryId: (entry.args.entryId).toString(),
                blockNumber: entry.blockNumber,
                tag: geth_connector_1.GethConnector.getInstance().web3.toUtf8(entry.args.tag)
            });
        }
    });
    comments.watch((err, comment) => {
        if (err) {
            cb({ message: err.message, type: eventTypes.COMMENT });
        }
        if (set_filter_1.filter.hasAddress(comment.args.profile)) {
            hydrateWithProfile(cb, comment.args.profile, {
                type: eventTypes.COMMENT,
                profileAddress: comment.args.profile,
                entryId: (comment.args.entryId).toString(),
                blockNumber: comment.blockNumber,
                commentId: (comment.args.commentId).toString()
            });
        }
    });
    votes.watch((err, vote) => {
        if (err) {
            cb({ message: err.message, type: eventTypes.VOTE });
        }
        if (set_filter_1.filter.hasAddress(vote.args.profile)) {
            hydrateWithProfile(cb, vote.args.profile, {
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