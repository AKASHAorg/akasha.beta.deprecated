'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const sp_1 = require('@akashaproject/core/sp');
const constants_1 = require('@akashaproject/common/constants');
const index_1 = require('../app/index');
const init_modules_1 = require('./init-modules');
const register_web3_provider_1 = require('./register-web3-provider');
const pino = require('pino');
const watcher_1 = require('./watcher');
let appLogger;
let duplexChannel;
const startApp = (web3, vault) => {
  if (!web3) {
    return index_1.bootstrap(false, false);
  }
  sp_1.getService(constants_1.CORE_MODULE.WEB3_API).instance = web3;
  if (vault.length) {
    sp_1.getService(constants_1.CORE_MODULE.WEB3_API).instance.eth.defaultAccount = vault[0];
  }
  index_1.bootstrap(true, !!vault.length, duplexChannel.ipcChannelUI, appLogger.child({ module: 'UI' }));
};
const bootstrapApp = async function () {
  appLogger = pino({ browser: { asObject: true } });
  if (process.env.AKASHA_LOG_LEVEL) {
    appLogger.level = process.env.AKASHA_LOG_LEVEL;
  }
  else if (!process.env.HOT) {
    appLogger.level = 'error';
  }
  await init_modules_1.default(sp_1.default, sp_1.getService, appLogger)
    .then((modules) => {
      appLogger.info('modules inited');
      duplexChannel = watcher_1.default(modules, 'workerId', sp_1.getService, appLogger);
      appLogger.info('api listening');
    });
  register_web3_provider_1.default(startApp);
};
exports.default = bootstrapApp;
//# sourceMappingURL=main.js.map