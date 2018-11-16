import * as Promise from 'bluebird';
import { CORE_MODULE, GETH_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* () {
    const helper = getService(CORE_MODULE.WEB3_HELPER);
    const status = yield helper.inSync();
    // @TODO: reimplement this at app lvls
    // if (!connected) {
    // web3Api.instance = regenWeb3();
    // connected = web3Api.instance.isConnected();
    // }
    // if (connected) {
    //     gethStatus.process = true;
    //     gethStatus.api = true;
    //     gethStatus.version = yield web3Api.instance.version.getNodeAsync();
    //     gethStatus.networkID = yield web3Api.instance.version.getNetworkAsync();

    // @TODO: reimplement this at app lvl
    // const accounts = yield web3Api.instance.eth.getAccountsAsync();
    // if (accounts.length) {

    // gethStatus.ethKey = accounts[0];
    // }
    // }
    console.log('status', status);
    yield (getService(CORE_MODULE.CONTRACTS)).init();
    return { started: !!status.length };
  });
  const startService = { execute, name: 'startService' };
  const service = function () {
    return startService;
  };
  sp().service(GETH_MODULE.startService, service);
  return startService;
}
