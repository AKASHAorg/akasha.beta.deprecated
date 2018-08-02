import IpfsConnector from '@akashaproject/ipfs-js-connector';
import { bootstrap } from '../app/index-dark';
import initModules from './init-modules';
import { ipfsApi, ipfsProvider, regenWeb3, web3Api } from './services';
import web3Helper from './modules/helpers/web3-helper';
import getChannels from './channels';
import { DEFAULT_IPFS_CONFIG } from './config/settings';


declare const web3;
declare const ipfs;

window.addEventListener('load', function () {
  let web3Local;

  // if (typeof ipfs !== 'undefined') {
  //     ipfsProvider.instance = ipfs;
  // } else {
  //     ipfsProvider.instance = {};
  // }
  ipfsProvider.instance = {};
  if (typeof web3 !== 'undefined') {
    web3Local = regenWeb3();
    return web3Local.eth.getAccounts((err, accList) => {
      if (err) {
        throw err;
      }
      web3Api.instance = web3Local;
      web3Api.instance.eth.defaultAccount = accList[0];
      return startApp(web3Local, !!accList.length);
    });

  }
  startApp(false, true);
});


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
  // Object.defineProperty(window, 'Channel', {value: getChannels()});
  // Object.defineProperty(window, 'ipfs', { value: IpfsConnector });
  // Object.defineProperty(window, 'contracts', {value: contracts});
  // end

  web3Helper.setChannel(getChannels().client.tx.emitMined);
  console.timeEnd('bootstrap');
  bootstrap(true, vault);
};
