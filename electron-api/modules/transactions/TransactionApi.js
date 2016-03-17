
const Promise = require('bluebird');
const web3 = gethInstance.web3;
const helpers = require('../geth/helpers');
const agas = require('../contracts/gas');
const logger = require('../../loggers').getInstance();
const log = logger.registerLogger('transaction', { level: 'info', consoleLevel: 'info' });

const symbolCheck = Symbol();
const symbol      = Symbol();

class TransactionsClass {

  /**
   * @param enforcer
   */
  constructor (enforcer) {
    if (enforcer !== symbolCheck) {
      throw new Error('Transaction: Cannot construct singleton!');
    }
    log.info('Transaction: Everything ok;');
  }

  /**
   * @returns {*}
   */
  static getInstance () {
    if (!this[symbol]) {
      this[symbol] = new TransactionsClass(symbolCheck);
    }
    return this[symbol];
  }

  /**
   * Estimate gas usage for transactions;
   */
  estimate (operation) {
    if (operation === 'send') {
      const gas = 21037;
      const gasPrice = parseFloat(gas * agas.unit_gas_price).toFixed(4);
      const cost = gasPrice + ' ' + agas.unit; // eslint-disable-line
      return { gas, cost };
    }
    return { gas: -1, cost: '' };
  }

  /**
   * Send Ether to another address;
   * @returns {Promise}
   */
  send (options) {
    return gethInstance.inSync().then((syncing) => {
      if (syncing) {
        throw new Error('GETH is not in sync!');
      }
      if (!web3.eth.defaultAccount) {
        throw new Error('default address not set!');
      }
      if (!options.to || !web3.isAddress(options.to)) {
        throw new Error('invalid TO address!');
      }
      if (!options.amount || options.amount < 0) {
        throw new Error('invalid AMOUNT!');
      }
      log.info(`Transaction: Sending "${options.amount} wei" to "${options.to}"..`);
      return this._send(options);
    });
  }

  /**
   * Send Ether to another address (private);
   * @private
   */
  _send (options) {
    let balance1 = 0;
    let balance2 = 0;

    return new Promise((resolve, reject) => {
      web3.eth.getBalanceAsync(options.to)
        .then((balance) => {
          balance1 = balance.toNumber();
          return web3.eth.sendTransactionAsync({
            to:       options.to,
            value:    options.amount,
            gas:      22000,
            gasPrice: agas.gas_price
          });
        }).then((txHash) => {
          helpers.watchTx('sendEther()', txHash, (err, success) => {
            if (err) {
              reject(err);
              return;
            }
            web3.eth.getBalance(options.to, (_, balance) => {
              balance2 = balance.toNumber();
              if (balance1 + options.amount !== balance2) {
                reject(`balance doesnt match ${balance1 + options.amount} != ${balance2}`);
              } else {
                resolve({ old_balance: balance1, balance: balance2 }); // eslint-disable-line
              }
            });
          });
        })
        .catch((err) => {
          reject(err.toString());
        });
    });
  }

  /**
   * Wait for coinbase address to have "amount" balance;
   * @returns {Promise}
   */
  wait (amount) {
    if (!amount) {
      amount = parseInt(web3.toWei(1, 'ether'));
    }
    return gethInstance.inSync().then((syncing) => {
      if (syncing) {
        throw new Error('GETH is not in sync!');
      }
      if (!web3.eth.defaultAccount) {
        throw new Error('coinbase not set!');
      }
      log.info('Transaction: Waiting for coinbase address to be funded...');
      return this._wait(amount);
    });
  }

  /**
   * Wait for coinbase address to have "amount" balance (private);
   * @private
   */
  _wait (amount) {
    const me = web3.eth.defaultAccount;
    return new Promise((resolve, reject) => {
      let interval = 0;
      interval = setInterval(() => {
        web3.eth.getBalance(me, (err, balance) => {
          if (err) {
            clearInterval(interval);
            reject(err.toString());
            return;
          }
          if (balance.toNumber() >= amount) {
            clearInterval(interval);
            log.info(`Transaction: Address ${me} has a balance of ${balance};`);
            resolve({ balance: balance.toNumber() });
            return;
          }
        });
      }, 750);
    });
  }

}

export default TransactionsClass;
