import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';

const watchVotes = {
  id: '/watchVotes',
  type: 'object',
  properties: {
    akashaId: { type: 'string' },
    ethAddress: { type: 'string', format: 'address' },
    fromBlock: { type: 'number' },
  },
};

const EVENT_TYPE = 'VOTE_EVENT';
export default function init(sp, getService) {

  const execute = Promise.coroutine(function* (data, cb) {

    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    v.validate(data, watchVotes, { throwError: true });
    const contracts = getService(CORE_MODULE.CONTRACTS);
    const entriesCache = getService(NOTIFICATIONS_MODULE.entriesCache);
    const queue = getService(NOTIFICATIONS_MODULE.queue);

    const ethAddress = yield (getService(COMMON_MODULE.profileHelpers)).profileAddress(data);
    if (!entriesCache.getAll().length) {
      const fetchedEntries = yield contracts
      .fromEvent(
        contracts.instance.Entries.Publish, { author: ethAddress }, 0,
        1000, { lastIndex: 0, reversed: true });
      for (const event of fetchedEntries.results) {
        yield entriesCache.push(event.args.entryId);
      }
    }

    const voteEvent = contracts.createWatcher(
      contracts.instance.Votes.Vote, { voteType: 0 }, data.fromBlock,
    );
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
              weight: ev.args.negative ?
                '-' + (ev.args.weight).toString(10) : (ev.args.weight).toString(10),
            },
            blockNumber: ev.blockNumber,
          },
        );
      }
    });

    return voteEvent;
  });
  const service = function () {
    return execute;
  };
  sp().service(NOTIFICATIONS_MODULE.votes, service);

  return execute;
}
