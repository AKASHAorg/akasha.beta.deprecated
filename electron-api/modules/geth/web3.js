import Web3Factory from 'web3';
import { toBoolVal, toIntVal, toIntValRestricted, toJSONObject, toStringVal } from './helpers';
import Promise from 'bluebird';

class Web3 {

  /**
   * @param admin
   * @param miner
   * @param personal
   */
  constructor ({ admin = true, miner = false, personal = true } = {}) {

    this.adminInit    = false;
    this.minerInit    = false;
    this.personalInit = false;

    this._web3        = new Web3Factory();
    this._web3.net = Promise.promisifyAll(this._web3.net);
    this._web3.shh = Promise.promisifyAll(this._web3.shh);
    this._web3.eth = Promise.promisifyAll(this._web3.eth);

    if (admin) {
      this.initAdmin();
    }

    if (miner) {
      this.initMiner();
    }

    if (personal) {
      this.initPersonal();
    }

  }

  get web3 () {
    return this._web3;
  }

  initAdmin () {
    if (this.adminInit) {
      return;
    }

    this._adminMethods().forEach(method => {
      this._web3._extend({
        property: 'admin',
        methods:  [new this._web3._extend.Method(method)]
      });
    });
    this._web3.admin = Promise.promisifyAll(this._web3.admin);
    this.adminInit = true;
  }

  initMiner () {
    if (this.minerInit) {
      return;
    }

    this._minerMethods().forEach(method => {
      this._web3._extend({
        property: 'miner',
        methods:  [new this._web3._extend.Method(method)]
      });
    });
    this._web3.miner = Promise.promisifyAll(this._web3.miner)
    this.minerInit = true;
  }

  initPersonal () {
    if (this.personalInit) {
      return;
    }

    this._personalMethods().forEach(method => {
      this._web3._extend({
        property: 'personal',
        methods:  [new this._web3._extend.Method(method)]
      });
    });
    this._web3.personal = Promise.promisifyAll(this._web3.personal);
    this.personalInit = true;
  }

  setProvider (gethIpc, socket) {
    if (!this._web3.currentProvider) {
      this._web3.setProvider(new this._web3.providers.IpcProvider(gethIpc, socket));
    }
  }

  _personalMethods () {

    return [
      {
        name:            'unlockAccount',
        call:            'personal_unlockAccount',
        params:          3,
        inputFormatter:  [this._web3._extend.utils.toAddress, toStringVal, toIntVal],
        outputFormatter: toBoolVal
      },
      {
        name:            'newAccount',
        call:            'personal_newAccount',
        params:          1,
        inputFormatter:  [toStringVal],
        outputFormatter: toStringVal
      },
      {
        name:            'listAccounts',
        call:            'personal_listAccounts',
        params:          0,
        outputFormatter: toJSONObject
      },
      {
        name:            'deleteAccount',
        call:            'personal_deleteAccount',
        params:          2,
        inputFormatter:  [this._web3._extend.utils.toAddress, toStringVal],
        outputFormatter: toBoolVal
      }
    ];
  }

  _adminMethods () {
    return [
      {

        name:           'verbosity',
        call:           'admin_verbosity',
        params:         1,
        inputFormatter: [toIntValRestricted]

      },
      {

        name:            'nodeInfo',
        call:            'admin_nodeInfo',
        params:          0,
        outputFormatter: toJSONObject

      },
      {

        name:            'addPeer',
        call:            'admin_addPeer',
        params:          1,
        inputFormatter:  [toStringVal],
        outputFormatter: toBoolVal

      },
      {

        name:            'peers',
        call:            'admin_peers',
        params:          0,
        outputFormatter: toJSONObject

      },
      {

        name:            'startRPC',
        call:            'admin_startRPC',
        params:          4,
        inputFormatter:  [toStringVal, toIntVal, toStringVal, toStringVal],
        outputFormatter: toBoolVal

      },
      {

        name:            'stopRPC',
        call:            'admin_stopRPC',
        params:          0,
        outputFormatter: toBoolVal

      },
      {

        name:           'sleepBlocks',
        call:           'admin_sleepBlocks',
        params:         1,
        inputFormatter: [toIntVal]

      },
      {

        name:            'datadir',
        call:            'admin_datadir',
        params:          0,
        outputFormatter: toStringVal

      },
      {

        name:            'setSolc',
        call:            'admin_setSolc',
        params:          1,
        inputFormatter:  [toStringVal],
        outputFormatter: toStringVal

      },
      {

        name:            '',
        call:            'admin_',
        params:          0,
        inputFormatter:  [this._web3._extend.utils.toAddress, toStringVal, toIntVal],
        outputFormatter: toStringVal

      },
      {

        name:            'getContractInfo',
        call:            'admin_getContractInfo',
        params:          1,
        inputFormatter:  [this._web3._extend.utils.toAddress],
        outputFormatter: toJSONObject

      },
      {

        name:            'saveInfo',
        call:            'admin_saveInfo',
        params:          0,
        inputFormatter:  [toJSONObject, toStringVal],
        outputFormatter: toStringVal

      },
      {

        name:            'register',
        call:            'admin_register',
        params:          3,
        inputFormatter:  [this._web3._extend.utils.toAddress, this._web3._extend.utils.toAddress, toStringVal],
        outputFormatter: toBoolVal

      },
      {

        name:            'registerUrl',
        call:            'admin_registerUrl',
        params:          3,
        inputFormatter:  [this._web3._extend.utils.toAddress, toStringVal, toStringVal],
        outputFormatter: toBoolVal

      }
    ];
  }

  _minerMethods () {
    return [
      {
        name:            'start',
        call:            'miner_start',
        params:          1,
        inputFormatter:  [toIntVal],
        outputFormatter: toBoolVal
      },
      {
        name:            'stop',
        call:            'miner_stop',
        params:          1,
        inputFormatter:  [toIntVal],
        outputFormatter: toBoolVal
      }
    ];
  }
}

export default Web3;
