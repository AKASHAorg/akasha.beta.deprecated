import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import { filter } from './set-filter';
import { GethConnector } from '@akashaproject/geth-connector';
import getProfileData from '../profile/profile-data';
import getEntry from '../entry/get-entry';

let entries;
let comments;
let votes;
let following;
const eventTypes = {
    VOTE: 'vote',
    COMMENT: 'comment',
    PUBLISH: 'publish',
    FOLLOWING: 'following'
};

const hydrateWithProfile = (cb, profile, entry, extra) => {
    const queue = [];
    queue.push(getProfileData.execute({ profile: profile }));
    queue.push(getEntry.execute({ entryId: entry }));
    Promise.all(queue)
        .then((result) => {
            cb('', Object.assign(extra, { author: result[0], entry: result[1] }))
        })
        .catch((error) => {
            cb({ message: error.message }, extra)
        });
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
        following.stopWatching(() => {
            following = null;
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
    following = contracts.instance.feed.contract.Follow({ following: filter.getMyAddress() }, filterBlock);
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
                cb('',
                    {
                        type: eventTypes.FOLLOWING,
                        blockNumber: event.blockNumber,
                        follower: data,
                        profileAddress: event.args.following
                    }
                )
            });
    });
    return { running: true }
});

export default { execute, name: 'feed' };
