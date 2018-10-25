import IpfsConnector from '@akashaproject/ipfs-js-connector';
import { bootstrap } from '../app/index';
import initModules from './init-modules';
import { ipfsApi } from './services';
// import web3Helper from './modules/helpers/web3-helper';
import getChannels from './channels';
import contracts from './contracts';
import { DEFAULT_IPFS_CONFIG } from './config/settings';

const registerWeb3Provider = function (nextExecution) {
  window.addEventListener('load', async () => {
    let web3Local;

    ipfsProvider.instance = {};
    if (window.hasOwnProperty('ethereum')) {
      web3Local = regenWeb3(window['ethereum']);
      try {
        await (window['ethereum']).enable();
        web3Local.eth.getAccounts((err, accList) => {
          if (err) {
            throw err;
          }
          web3Api.instance = web3Local;
          web3Api.instance.eth.defaultAccount = accList[0];
          nextExecution(web3Local, !!accList.length);
        });
      } catch (e) {
        nextExecution(web3Local, false);
      }

    } else {
      nextExecution(false, false);
    }
  });
};
const startApp = (web3, vault) => {
  if (!web3) {
    return bootstrap(false, false);
  }

  ipfsApi.instance = IpfsConnector.getInstance();
  console.time('bootstrap');
  IpfsConnector.getInstance().setOption('config', DEFAULT_IPFS_CONFIG);
  IpfsConnector.getInstance().setOption('repo', 'ipfs#akasha-beta');
  initModules();
  // for dev only
  Object.defineProperty(window, 'ipfs', { value: IpfsConnector });
  Object.defineProperty(window, 'Channel', { value: getChannels() });
  Object.defineProperty(window, 'contracts', { value: contracts });
  // end

  // web3Helper.setChannel(getChannels().client.tx.emitMined);
  console.timeEnd('bootstrap');
  bootstrap(true, vault);
};

// start the app
registerWeb3Provider(startApp);