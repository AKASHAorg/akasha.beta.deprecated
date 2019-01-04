"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const ramda_1 = require("ramda");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    class EntriesCache {
        constructor() {
            this.published = [];
            this.canVote = [];
        }
        push(entryId) {
            if (ramda_1.contains(entryId, this.published) || ramda_1.isNil(entryId)) {
                return Promise.resolve();
            }
            return (getService(constants_1.CORE_MODULE.CONTRACTS)).instance
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
    sp().service(constants_1.NOTIFICATIONS_MODULE.entriesCache, service);
    return entriesCache;
}
exports.default = init;
//# sourceMappingURL=entries.js.map