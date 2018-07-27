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


export const moduleName = 'notifications';

const init = function init(sp, getService) {

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
    comment,
    donations,
    entries,
    excludeFilter,
    feed,
    includeFilter,
    queue,
    setFilter,
    subscribe,
    votes,
  };
};
const app = {
  init,
  moduleName,
};

export default app;
