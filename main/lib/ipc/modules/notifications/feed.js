"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const set_filter_1 = require("./set-filter");
const geth_connector_1 = require("@akashaproject/geth-connector");
const profile_data_1 = require("../profile/profile-data");
const get_entry_1 = require("../entry/get-entry");
const current_profile_1 = require("../registry/current-profile");
const resolve_ethaddress_1 = require("../registry/resolve-ethaddress");
const address_of_akashaid_1 = require("../registry/address-of-akashaid");
const settings_1 = require("../../config/settings");
const queue_1 = require("./queue");
let entries;
let comments;
let votes;
let following;
let tipping;
let mention;
const eventTypes = {
    VOTE: 'vote',
    COMMENT: 'comment',
    PUBLISH: 'publish',
    FOLLOWING: 'following',
    TIPPED: 'gotTipped'
};
const VALUE_UNIT = 'ether';
const hydrateWithProfile = (cb, profile, entry, extra) => {
    const batch = [];
    batch.push(profile_data_1.default.execute({ profile: profile }));
    batch.push(get_entry_1.default.execute({ entryId: entry }));
    Promise.all(batch)
        .then((result) => {
        queue_1.default.push(cb, Object.assign(extra, { author: result[0], entry: result[1] }));
    })
        .catch((error) => {
        cb({ message: error.message }, extra);
    });
};
const emitMention = Promise.coroutine(function* (event, akashaId, cb) {
    let message;
    const unmarshall = geth_connector_1.GethConnector.getInstance().web3.toUtf8(event.payload);
    try {
        message = JSON.parse(unmarshall);
    }
    catch (err) {
        cb(err);
    }
    if (!message.hasOwnProperty('mention') || message.mention.indexOf(akashaId) === -1) {
        return null;
    }
    if (!message.hasOwnProperty('akashaId')
        || !message.hasOwnProperty('mentionType')
        || !message.hasOwnProperty('entryId')) {
        return null;
    }
    const sender = yield address_of_akashaid_1.default.execute([{ akashaId: message.akashaId }]);
    return hydrateWithProfile(cb, sender.collection[0], message.entryId, {
        type: message.mentionType,
        profileAddress: sender.collection[0],
        receiver: akashaId,
        timeStamp: event.sent,
        hash: event.hash,
        commentId: message.commentId
    });
});
const execute = Promise.coroutine(function* (data, cb) {
    if (!index_1.constructed.instance) {
        return { running: false };
    }
    if (data.stop) {
        queue_1.default.clear();
        if (entries) {
            entries.stopWatching(() => {
                entries = null;
            });
            comments.stopWatching(() => {
                comments = null;
            });
            votes.stopWatching(() => {
                votes = null;
            });
            following.stopWatching(() => {
                following = null;
            });
            tipping.stopWatching(() => {
                tipping = null;
            });
            mention.stopWatching(() => {
                mention = null;
            });
        }
        return { running: false };
    }
    if (entries) {
        return { running: true, warn: true };
    }
    const filterBlock = { fromBlock: set_filter_1.filter.getBlockNr(), toBlock: 'latest' };
    const myProfile = yield current_profile_1.default.execute();
    const profileInstance = index_1.constructed.instance.profile.contract.at(myProfile.profileAddress);
    entries = index_1.constructed.instance.entries.contract.Publish({}, filterBlock);
    comments = index_1.constructed.instance.comments.contract.Commented({}, filterBlock);
    votes = index_1.constructed.instance.votes.contract.Vote({}, filterBlock);
    following = index_1.constructed.instance.feed.contract.Follow({ following: set_filter_1.filter.getMyAddress() }, filterBlock);
    tipping = profileInstance.Tip({}, filterBlock);
    mention = geth_connector_1.GethConnector.getInstance().web3.shh.filter({ topics: [settings_1.MENTION_CHANNEL] });
    entries.watch((err, entry) => {
        if (err) {
            cb({ message: err.message, type: eventTypes.PUBLISH });
        }
        if (set_filter_1.filter.hasAddress(entry.args.author)) {
            hydrateWithProfile(cb, entry.args.author, (entry.args.entryId).toString(), {
                type: eventTypes.PUBLISH,
                profileAddress: entry.args.author,
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
            hydrateWithProfile(cb, comment.args.profile, (comment.args.entryId).toString(), {
                type: eventTypes.COMMENT,
                profileAddress: comment.args.profile,
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
            hydrateWithProfile(cb, vote.args.profile, (vote.args.entry).toString(), {
                type: eventTypes.VOTE,
                profileAddress: vote.args.profile,
                blockNumber: vote.blockNumber,
                weight: (vote.args.weight).toNumber()
            });
        }
    });
    following.watch((err, event) => {
        if (err) {
            cb({ message: err.message, type: eventTypes.FOLLOWING });
        }
        profile_data_1.default
            .execute({ profile: event.args.follower })
            .then((data) => {
            queue_1.default.push(cb, {
                type: eventTypes.FOLLOWING,
                blockNumber: event.blockNumber,
                follower: data,
                profileAddress: event.args.following
            });
        });
    });
    tipping.watch((err, event) => {
        if (err) {
            cb({ message: err.message, type: eventTypes.TIPPED });
        }
        resolve_ethaddress_1.default
            .execute({ ethAddress: event.args.from })
            .then((profile) => {
            const ethers = geth_connector_1.GethConnector.getInstance().web3.fromWei(event.args.value, VALUE_UNIT);
            return profile_data_1.default.execute({ profile: profile.profileAddress })
                .then((resolvedProfile) => {
                queue_1.default.push(cb, {
                    profile: resolvedProfile,
                    blockNumber: event.blockNumber,
                    value: ethers.toString(10),
                    unit: VALUE_UNIT,
                    type: eventTypes.TIPPED
                });
            });
        })
            .catch((e) => {
            cb({ message: e.message, type: eventTypes.TIPPED });
        });
    });
    const newerThan = (data.newerThan) ? data.newerThan : 0;
    mention.watch(function (err, event) {
        if (err) {
            return cb(err);
        }
        if (event.hasOwnProperty('payload')) {
            if (event.sent < newerThan) {
                return;
            }
            emitMention(event, myProfile.akashaId, cb);
        }
    });
    return { running: true };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'feed' };
//# sourceMappingURL=feed.js.map