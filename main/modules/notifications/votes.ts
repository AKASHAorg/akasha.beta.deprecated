import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { profileAddress } from '../profile/helpers';
import entriesCache from './entries';
import queue from './queue';

const watchVotes = {
    'id': '/watchVotes',
    'type': 'object',
    'properties': {
        'akashaId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'fromBlock': { 'type': 'number' }
    }
};
const EVENT_TYPE = 'VOTE_EVENT';
export const execute = Promise.coroutine(function* (data: { ethAddress?: string, akashaId?: string, fromBlock: number }, cb) {

    const v = new schema.Validator();
    v.validate(data, watchVotes, { throwError: true });
    const ethAddress = yield profileAddress(data);
    if (!entriesCache.getAll().length) {
        const fetchedEntries = yield contracts
            .fromEvent(contracts.instance.Entries.Publish, { author: ethAddress }, 0,
                1000, { lastIndex: 0, reversed: true });
        for (let event of fetchedEntries.results) {
            yield entriesCache.push(event.args.entryId);
        }
    }

    const voteEvent = contracts.createWatcher(contracts.instance.Votes.Vote, { voteType: 0 }, data.fromBlock);
    voteEvent.watch((err, ev) => {
        if (err) {
            return;
        }
        if (entriesCache.has(ev.args.target)) {
            queue.push(
                cb,
                {
                    type: EVENT_TYPE,
                    payload: {
                        entryId: ev.args.target,
                        voter: ev.args.voter,
                        weight: ev.args.negative ? '-' + (ev.args.weight).toString(10) : (ev.args.weight).toString(10)
                    },
                    blockNumber: ev.blockNumber
                }
            );
        }
    });

    return voteEvent;
});
