import * as Promise from 'bluebird';
import { contains, isNil } from 'ramda';
import { CORE_MODULE, NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    class EntriesCache {
        constructor() {
            this.published = [];
            this.canVote = [];
        }
        push(entryId) {
            if (contains(entryId, this.published) || isNil(entryId)) {
                return Promise.resolve();
            }
            return (getService(CORE_MODULE.CONTRACTS)).instance
                .Votes
                .getRecord(entryId)
                .then((record) => {
                if (record[2] > (Date.now() / 1000)) {
                    this.canVote.push(entryId);
                }
                this.published.push(entryId);
            });
        }
        getAll() {
            return this.published;
        }
        reset() {
            this.published.length = 0;
        }
        getOnlyVote() {
            return this.canVote;
        }
        has(entryId) {
            return this.published.indexOf(entryId) !== -1;
        }
        inVotingPeriod(entryId) {
            return this.canVote.indexOf(entryId) !== -1;
        }
    }
    const entriesCache = new EntriesCache();
    const service = function () {
        return entriesCache;
    };
    sp().service(NOTIFICATIONS_MODULE.entriesCache, service);
    return entriesCache;
}
//# sourceMappingURL=entries.js.map