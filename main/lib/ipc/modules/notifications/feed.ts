import * as Promise from 'bluebird';
//import { constructed as contracts } from '../../contracts/index';

let entries;
let comments;
let votes;
/**
 * Get total number of your follows
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { stop?: boolean }) {
    if(data.stop && entries) {
        entries.stopWatching(() => { entries = null;});
        comments.stopWatching(() => { comments = null;});
        votes.stopWatching(() => { votes = null;});
    }
    //const count = yield contracts.instance.feed.getFollowingCount(data.akashaId);
    return { }
});

export default { execute, name: 'getFollowingCount' };
