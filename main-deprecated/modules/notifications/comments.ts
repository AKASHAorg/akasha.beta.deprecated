import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { profileAddress } from '../profile/helpers';
import entriesCache from './entries';
import queue from './queue';

const watchComments = {
    'id': '/watchComments',
    'type': 'object',
    'properties': {
        'akashaId': { 'type': 'string' },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'fromBlock': { 'type': 'number' }
    }
};
const EVENT_TYPE = 'COMMENT_EVENT';
export const execute = Promise.coroutine(function* (data: { ethAddress?: string, akashaId?: string, fromBlock: number }, cb) {

    const v = new schema.Validator();
    v.validate(data, watchComments, { throwError: true });
    const ethAddress = yield profileAddress(data);
    if (!entriesCache.getAll().length) {
        const fetchedEntries = yield contracts
            .fromEvent(contracts.instance.Entries.Publish, { author: ethAddress }, 0,
                1000, { lastIndex: 0, reversed: true });
        for (let event of fetchedEntries.results) {
            yield entriesCache.push(event.args.entryId);
        }
    }

    const commentEvent = contracts.createWatcher(contracts.instance.Comments.Publish, {}, data.fromBlock);
    commentEvent.watch((err, ev) => {
        if (err) {
            return;
        }
        if (entriesCache.has(ev.args.entryId) && ev.args.author !== ethAddress) {
            queue.push(
                cb,
                {
                    type: EVENT_TYPE,
                    payload: ev.args,
                    blockNumber: ev.blockNumber
                }
            );
        }
    });
    return commentEvent;
});
