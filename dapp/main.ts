import sp, { getService } from '@akashaproject/core/sp';
import { CORE_MODULE } from '@akashaproject/common/constants';
import { bootstrap } from '../app/index';
import initModules from './init-modules';
import registerWeb3Provider from './register-web3-provider';
import * as pino from 'pino';
import startDataStream from './watcher';

let appLogger;
let duplexChannel;

const startApp = (web3, vault) => {
  if (!appLogger || !duplexChannel) {
    throw new Error('Must set appLogger and duplexChannel before starting');
  }
  if (!web3) {
    return bootstrap(false, false);
  }
  getService(CORE_MODULE.WEB3_API).instance = web3;
  // web3 send default address
  if (vault.length) {
    getService(CORE_MODULE.WEB3_API).instance.eth.defaultAccount = vault[0];
  }

  // must refactor this
  // web3Helper.setChannel(getChannels().client.tx.emitMined);
  console.log(duplexChannel);
  bootstrap(true, !!vault.length, duplexChannel.ipcChannelUI, appLogger.child({ module: 'UI' }));
};

const bootstrapApp = async function () {
  appLogger = pino({ browser: { asObject: true } });

  // default logging lvl is info
  if (process.env.AKASHA_LOG_LEVEL) {
    appLogger.level = process.env.AKASHA_LOG_LEVEL;
  } else if (!process.env.HOT) {

    // production logs
    appLogger.level = 'error';
  }
  await initModules(sp, getService, appLogger)
    .then((modules) => {
      appLogger.info('modules inited');
      // Usage from ui
      // ipcChannelUI.on((err, d) => console.log("ui received", "err=", err, "data=", d))
      // ipcChannelUI.send({module:'geth', method:'status_geth', payload: {}});
      duplexChannel = startDataStream(modules, 'workerId', getService, appLogger);
      getService(CORE_MODULE.WEB3_HELPER).setChannel(duplexChannel.ipcChannelMain);
      appLogger.info('api listening');
    });

  registerWeb3Provider(startApp);
};
export default bootstrapApp;
