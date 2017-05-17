import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { filter } from './set-filter';
import { GethConnector } from '@akashaproject/geth-connector';
import getProfileData from '../profile/profile-data';
import getEntry from '../entry/get-entry';
import currentProfile from '../registry/current-profile';
import resolveProfile from '../registry/resolve-ethaddress';
import addressOf from '../registry/address-of-akashaid';
import { MENTION_CHANNEL } from '../../config/settings';
import queue from './queue';

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
    batch.push(getProfileData.execute({ profile: profile }));
    batch.push(getEntry.execute({ entryId: entry }));
    Promise.all(batch)
        .then((result) => {
            queue.push(cb, Object.assign(extra, { author: result[0], entry: result[1] }));
        })
        .catch((error) => {
            cb({ message: error.message }, extra);
        });
};

const emitMention = Promise.coroutine(function*(event, akashaId, cb) {
    let message;
    const unmarshall = GethConnector.getInstance().web3.toUtf8(event.payload);

    try {
        message = JSON.parse(unmarshall);
    } catch (err) {
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
    const sender = yield addressOf.execute([{ akashaId: message.akashaId }]);
    return hydrateWithProfile(
        cb,
        sender.collection[0],
        message.entryId,
        {
            type: message.mentionType,
            profileAddress: sender.collection[0],
            receiver: akashaId,
            timeStamp: event.sent,
            hash: event.hash,
            commentId: message.commentId
        }
    );
});
/**
 * Get total number of your follows
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { stop?: boolean, newerThan?: number }, cb) {
    if (!contracts.instance) {
        return { running: false };
    }

    if (data.stop) {
        // clear all pending notifs
        queue.clear();
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

    const filterBlock = { fromBlock: filter.getBlockNr(), toBlock: 'latest' };
    const myProfile = yield currentProfile.execute();
    const profileInstance = contracts.instance.profile.contract.at(myProfile.profileAddress);
    entries = contracts.instance.entries.contract.Publish({}, filterBlock);
    comments = contracts.instance.comments.contract.Commented({}, filterBlock);
    votes = contracts.instance.votes.contract.Vote({}, filterBlock);
    following = contracts.instance.feed.contract.Follow({ following: filter.getMyAddress() }, filterBlock);
    tipping = profileInstance.Tip({}, filterBlock);
    mention = GethConnector.getInstance().web3.shh.filter({ topics: [MENTION_CHANNEL] });

    entries.watch((err, entry) => {
        if (err) {
            cb({ message: err.message, type: eventTypes.PUBLISH });
        }
        if (filter.hasAddress(entry.args.author)) {
            hydrateWithProfile(
                cb,
                entry.args.author,
                (entry.args.entryId).toString(),
                {
                    type: eventTypes.PUBLISH,
                    profileAddress: entry.args.author,
                    blockNumber: entry.blockNumber,
                    tag: GethConnector.getInstance().web3.toUtf8(entry.args.tag)
                }
            );
        }
    });

    comments.watch((err, comment) => {
        if (err) {
            cb({ message: err.message, type: eventTypes.COMMENT });
        }
        if (filter.hasAddress(comment.args.profile)) {

            hydrateWithProfile(
                cb,
                comment.args.profile,
                (comment.args.entryId).toString(),
                {
                    type: eventTypes.COMMENT,
                    profileAddress: comment.args.profile,
                    blockNumber: comment.blockNumber,
                    commentId: (comment.args.commentId).toString()
                }
            );
        }
    });

    votes.watch((err, vote) => {
        if (err) {
            cb({ message: err.message, type: eventTypes.VOTE });
        }
        if (filter.hasAddress(vote.args.profile)) {
            hydrateWithProfile(
                cb,
                vote.args.profile,
                (vote.args.entry).toString(),
                {
                    type: eventTypes.VOTE,
                    profileAddress: vote.args.profile,
                    blockNumber: vote.blockNumber,
                    weight: (vote.args.weight).toNumber()
                }
            );
        }
    });

    following.watch((err, event) => {
        if (err) {
            cb({ message: err.message, type: eventTypes.FOLLOWING });
        }
        getProfileData
            .execute({ profile: event.args.follower })
            .then((data) => {
                queue.push(
                    cb,
                    {
                        type: eventTypes.FOLLOWING,
                        blockNumber: event.blockNumber,
                        follower: data,
                        profileAddress: event.args.following
                    }
                );
            });
    });

    tipping.watch((err, event) => {
        if (err) {
            cb({ message: err.message, type: eventTypes.TIPPED });
        }
        resolveProfile
            .execute({ ethAddress: event.args.from })
            .then((profile) => {
                const ethers = GethConnector.getInstance().web3.fromWei(event.args.value, VALUE_UNIT);
                return getProfileData.execute({ profile: profile.profileAddress })
                    .then((resolvedProfile) => {
                        queue.push(
                            cb,
                            {
                                profile: resolvedProfile,
                                blockNumber: event.blockNumber,
                                value: ethers.toString(10),
                                unit: VALUE_UNIT,
                                type: eventTypes.TIPPED
                            }
                        );
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

export default { execute, name: 'feed', hasStream: true };
