import Web3Factory from 'web3';
import Promise from 'bluebird';

class Web3 {

  /**
   * @param admin
   * @param miner
   * @param personal
   */
  constructor({ admin = true, miner = false, personal = true } = {}) {

    this.adminInit = false;
    this.minerInit = false;
    this.personalInit = false;

    this._web3 = new Web3Factory();
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

  get web3() {
    return this._web3;
  }

  initAdmin() {
    const { methods, properties } = this._adminMethods();

    if (this.adminInit) {
      return;
    }
    this._web3._extend({
      property: 'admin',
      methods,
      properties
    });

    this._web3.admin = Promise.promisifyAll(this._web3.admin);
    this.adminInit = true;
  }

  initMiner() {
    const { methods, properties } = this._minerMethods();
    if (this.minerInit) {
      return;
    }
    this._web3._extend({
      property: 'miner',
      methods,
      properties
    });

    this._web3.miner = Promise.promisifyAll(this._web3.miner);
    this.minerInit = true;
  }

  initPersonal() {
    if (this.personalInit) {
      return;
    }
    this._web3._extend({
      property: 'personal',
      methods: this._personalMethods().methods
    });
    this._web3.personal = Promise.promisifyAll(this._web3.personal);
    this.personalInit = true;
  }

  setProvider(gethIpc, socket) {
    if (!this._web3.currentProvider) {
      this._web3.setProvider(new this._web3.providers.IpcProvider(gethIpc, socket));
      this._web3.eth.getCoinbase((err, coinbase) => {
        if (err) {
          console.warn(err);
        } else if (coinbase) {
          this._web3.eth.defaultAccount = coinbase;
        }
      });
    }
  }

  _personalMethods() {

    return {
      methods: [
        new this._web3._extend.Method({
          name: 'unlockAccount',
          call: 'personal_unlockAccount',
          params: 3,

          inputFormatter: [
            this._web3._extend.utils.toAddress,
            this._web3._extend.utils.formatInputString,
            this._web3._extend.formatters.formatInputInt
          ],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        }),
        new this._web3._extend.Method({
          name: 'lockAccount',
          call: 'personal_lockAccount',
          params: 1,
          inputFormatter: [this._web3._extend.formatters.inputAddressFormatter]
        }),
        new this._web3._extend.Method({
          name: 'newAccount',
          call: 'personal_newAccount',
          params: 1,
          inputFormatter: [this._web3._extend.utils.formatInputString],
          outputFormatter: this._web3._extend.utils.formatOutputString
        }),

        new this._web3._extend.Method({
          name: 'listAccounts',
          call: 'personal_listAccounts',
          params: 0,
          inputFormatter: [null],
          outputFormatter: (obj) => obj
        }),

        new this._web3._extend.Method({
          name: 'deleteAccount',
          call: 'personal_deleteAccount',
          params: 2,
          inputFormatter: [this._web3._extend.utils.toAddress, this._web3._extend.utils.formatInputString],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        })
      ]
    };
  }

  _adminMethods() {
    return {
      methods: [
        new this._web3._extend.Method({
          name: 'addPeer',
          call: 'admin_addPeer',
          params: 1,
          inputFormatter: [this._web3._extend.utils.fromDecimal],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        }),

        new this._web3._extend.Method({
          name: 'exportChain',
          call: 'admin_exportChain',
          params: 1,
          inputFormatter: [null],
          outputFormatter: (obj) => obj
        }),

        new this._web3._extend.Method({
          name: 'importChain',
          call: 'admin_importChain',
          params: 1,
          inputFormatter: [null],
          outputFormatter: (obj) => obj
        }),

        new this._web3._extend.Method({
          name: 'verbosity',
          call: 'admin_verbosity',
          params: 1,
          inputFormatter: [this._web3._extend.utils.formatInputInt],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        }),

        new this._web3._extend.Method({
          name: 'setSolc',
          call: 'admin_setSolc',
          params: 1,
          inputFormatter: [null],
          outputFormatter: this._web3._extend.formatters.formatOutputString
        }),

        new this._web3._extend.Method({
          name: 'startRPC',
          call: 'admin_startRPC',
          params: 4,
          inputFormatter: [null, this._web3._extend.utils.formatInputInteger, null, null],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        }),

        new this._web3._extend.Method({
          name: 'stopRPC',
          call: 'admin_stopRPC',
          params: 0,
          inputFormatter: [],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        })
      ],
      properties: [
        new this._web3._extend.Property({
          name: 'nodeInfo',
          getter: 'admin_nodeInfo',
          outputFormatter: this._web3._extend.formatters.formatOutputString
        }),

        new this._web3._extend.Property({
          name: 'peers',
          getter: 'admin_peers',
          outputFormatter: (obj) => obj
        }),

        new this._web3._extend.Property({
          name: 'datadir',
          getter: 'admin_datadir',
          outputFormatter: this._web3._extend.formatters.formatOutputString
        }),

        new this._web3._extend.Property({
          name: 'chainSyncStatus',
          getter: 'admin_chainSyncStatus',
          outputFormatter: (obj) => obj
        })
      ]
    };
  }

  _minerMethods() {
    return {
      methods: [
        new this._web3._extend.Method({
          name: 'start',
          call: 'miner_start',
          params: 1,
          inputFormatter: [this._web3._extend.formatters.formatInputInt],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        }),

        new this._web3._extend.Method({
          name: 'stop',
          call: 'miner_stop',
          params: 1,
          inputFormatter: [this._web3._extend.formatters.formatInputInt],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        }),

        new this._web3._extend.Method({
          name: 'setExtra',
          call: 'miner_setExtra',
          params: 1,
          inputFormatter: [this._web3._extend.utils.formatInputString],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        }),

        new this._web3._extend.Method({
          name: 'setGasPrice',
          call: 'miner_setGasPrice',
          params: 1,
          inputFormatter: [this._web3._extend.utils.formatInputString],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        }),

        new this._web3._extend.Method({
          name: 'startAutoDAG',
          call: 'miner_startAutoDAG',
          params: 0,
          inputFormatter: [],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        }),

        new this._web3._extend.Method({
          name: 'stopAutoDAG',
          call: 'miner_stopAutoDAG',
          params: 0,
          inputFormatter: [],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        }),

        new this._web3._extend.Method({
          name: 'makeDAG',
          call: 'miner_makeDAG',
          params: 1,
          inputFormatter: [this._web3._extend.formatters.inputDefaultBlockNumberFormatter],
          outputFormatter: this._web3._extend.formatters.formatOutputBool
        })
      ],
      properties: [
        new this._web3._extend.Property({
          name: 'hashrate',
          getter: 'miner_hashrate',
          outputFormatter: this._web3._extend.utils.toDecimal
        })
      ]
    };
  }
}

export default Web3;
