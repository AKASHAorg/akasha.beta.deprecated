import addToQueueInit from './add-to-queue';
import emitMinedInit from './emit-mined';
import getTransactionInit from './get-transaction';
import { TX_MODULE } from '@akashaproject/common/constants';

const init = function init(sp, getService) {

  const addToQueue = addToQueueInit(sp, getService);
  const emitMined = emitMinedInit(sp, getService);
  const getTransaction = getTransactionInit(sp, getService);

  return {
    [TX_MODULE.addToQueue]: addToQueue,
    [TX_MODULE.emitMined]: emitMined,
    [TX_MODULE.getTransaction]: getTransaction,
  };
};

const app = {
  init,
  moduleName: TX_MODULE.$name,
};

export default app;
