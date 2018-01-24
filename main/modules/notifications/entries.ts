import { contains } from 'ramda';
import contracts from '../../contracts/index';

class EntriesCache {
    private published = [];
    private canVote = [];

    public push(entryId) {

        if (contains(entryId, this.published)) {
            return Promise.resolve();
        }
        return contracts.instance
            .Votes
            .getRecord(entryId)
            .then(record => {
                if (record[2] > (Date.now() / 1000) ) {
                    this.canVote.push(entryId);
                }
                this.published.push(entryId);
            });
    }

    public getAll() {
        return this.published;
    }

    public getOnlyVote() {
        return this.canVote;
    }

    public has(entryId) {
        return this.published.indexOf(entryId) !== -1;
    }

    public inVotingPeriod(entryId) {
        return this.canVote.indexOf(entryId) !== -1;
    }
}

export default new EntriesCache();
