import * as Promise from 'bluebird';
import { COMMON_MODULE, CORE_MODULE, NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';

const watchComments = {
  id: '/watchComments',
  type: 'object',
  properties: {
    akashaId: { type: 'string' },
    ethAddress: { type: 'string', format: 'address' },
    fromBlock: { type: 'number' },
  },
};

const EVENT_TYPE = 'COMMENT_EVENT';

export default function init(sp, getService) {

  const execute = Promise
    .coroutine(function* (data, cb) {

      const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
      v.validate(data, watchComments, { throwError: true });
      const ethAddress = yield (getService(COMMON_MODULE.profileHelpers)).profileAddress(data);
      const contracts = getService(CORE_MODULE.CONTRACTS);
      const entriesCache = getService(NOTIFICATIONS_MODULE.entriesCache);
      const queue = getService(NOTIFICATIONS_MODULE.queue);
      if (!entriesCache.getAll().length) {
        const fetchedEntries = yield contracts
          .fromEvent(
            contracts.instance.Entries.Publish, { author: ethAddress }, 0,
            1000, { lastIndex: 0, reversed: true });
        for (const event of fetchedEntries.results) {
          yield entriesCache.push(event.args.entryId);
        }
      }

      const commentEvent = contracts
        .createWatcher(contracts.instance.Comments.Publish, {}, data.fromBlock);

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
              blockNumber: ev.blockNumber,
            },
          );
        }
      });
      return commentEvent;
    });
  const service = function () {
    return execute;
  };
  sp().service(NOTIFICATIONS_MODULE.comments, service);

  return execute;

}
