import { CORE_MODULE } from '@akashaproject/common/constants';
import contractsInit from './contracts';
import responsesInit from './responses';
import servicesInit from './services';
import stashInit from './stash';
import web3HelperInit from './web3-helper';

import sp, { getService } from './sp';

const init = function init() {

  const settings = new Map();
  const getSettings = function () {
    return settings;
  };

  contractsInit(sp, getService);
  responsesInit(sp, getService);
  web3HelperInit(sp, getService);
  servicesInit(sp);
  stashInit(sp);
  sp().service(CORE_MODULE.SETTINGS, getSettings);
  return {};

};

const app = {
  init,
  moduleName: CORE_MODULE.$name,
};

export default app;
