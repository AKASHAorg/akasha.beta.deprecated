import commentInit from './comments';
import donationsInit from './donations';
import entriesInit from './entries';
import excludeFilterInit from './exclude-filter';
import feedInit from './feed';
import includeFilterInit from './include-filter';
import queueInit from './queue';
import setFilterInit from './set-filter';
import subscribeInit from './subscribe';
import votesInit from './votes';
import { NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';

const init = function init (sp, getService) {

  const comment = commentInit(sp, getService);
  const donations = donationsInit(sp, getService);
  const entries = entriesInit(sp, getService);
  const excludeFilter = excludeFilterInit(sp, getService);
  const feed = feedInit(sp, getService);
  const includeFilter = includeFilterInit(sp, getService);
  const queue = queueInit(sp, getService);
  const setFilter = setFilterInit(sp, getService);
  const subscribe = subscribeInit(sp, getService);
  const votes = votesInit(sp, getService);

  return {
    [NOTIFICATIONS_MODULE.comments]: comment,
    [NOTIFICATIONS_MODULE.donations]: donations,
    [NOTIFICATIONS_MODULE.entriesCache]: entries,
    [NOTIFICATIONS_MODULE.excludeFilter]: excludeFilter,
    [NOTIFICATIONS_MODULE.feed]: feed,
    [NOTIFICATIONS_MODULE.includeFilter]: includeFilter,
    [NOTIFICATIONS_MODULE.queue]: queue,
    [NOTIFICATIONS_MODULE.setFilter]: setFilter,
    [NOTIFICATIONS_MODULE.subscribe]: subscribe,
    [NOTIFICATIONS_MODULE.votes]: votes,
  };
};
const app = {
  init,
  moduleName: NOTIFICATIONS_MODULE.$name,
};

export default app;
