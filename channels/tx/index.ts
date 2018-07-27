import addToQueueInit from './add-to-queue';
import emitMinedInit from './emit-mined';
import getTransactionInit from './get-transaction';

export const moduleName = 'tx';
const init = function init(sp, getService) {

  const addToQueue = addToQueueInit(sp, getService);
  const emitMined = emitMinedInit(sp, getService);
  const getTransaction = getTransactionInit(sp, getService);

  return { addToQueue, emitMined, getTransaction };
};

const app = {
  init,
  moduleName,
};

export default app;
