/* eslint strict: 0 */
'use strict';

const Promise      = require('bluebird');
const path         = require('path');
const childProcess = require('child_process');
const geth         = require('./geth');
const net          = require('net');
const os           = require('os');
const Web3         = require('./web3');

const loggerRegistrar = require('../../loggers');

const platform = os.type();

const symbolEnforcer = Symbol();
const symbol         = Symbol();


class GethConnector {

  /**
   *
   * @param enforcer
   */
  constructor (enforcer) {
    if (enforcer !== symbolEnforcer) {
      throw new Error('Cannot construct singleton');
    }
    this.logger = loggerRegistrar.getInstance().registerLogger('geth', { maxsize: 1024 * 10 * 3 });

    this.socket     = new net.Socket();
    this.ipcStream  = new Web3();
    this.executable = null;

    this.gethProcess = null;
    this.dataDir     = null;
    this.ipcPath     = null;

    this.options = [];

    this._setSocketEvents();
  }

  /**
   *
   * @returns {*}
   */
  static getInstance () {
    if (!this[symbol]) {
      this[symbol] = new GethConnector(symbolEnforcer);
    }
    return this[symbol];
  }

  /**
   *
   * @param options
   */
  start (options = {}) {
    this._setOptions(options);

    this._checkGeth().then((binary) => {
      this.executable = binary;
      return this._spawnGeth({ detached: true }).then((data) => {
        setTimeout(() => {
          this.ipcStream.setProvider(this.ipcPath, this.socket);
        }, 4000);
        return data;
      }).catch((err) => {
        throw new Error(`Could not start geth ${err}`);
      });
    }).catch((err) => {
      this.logger.warn(`geth:binary:${err}`);
      throw new Error(`Could not download geth ${err}`);
    });
  }

  get web3 () {
    return this.ipcStream.web3;
  }

  /**
   * Stop and flush data
   */
  stop () {
    if (this.gethProcess) {
      this.gethProcess.kill();
      this.gethProcess = null;
    }

    if (this.socket.writable) {
      this.socket.destroy();
    }
  }

  /**
   * Check if geth client is syncing
   * @returns {Promise.<T>|*}
   */
  inSync () {
    const rules = [
      this.web3.eth.getSyncingAsync(),
      this.web3.net.getPeerCountAsync(),
      this.web3.eth.getBlockAsync('latest')
    ];

    return Promise.all(rules).then((data) => {
      const timeStamp = Math.floor(new Date().getTime() / 1000);
      if (data[0]) {
        return [data[1], data[0]];
      }

      if (!data[0] && data[1] > 0 && (data[2].timestamp + 60 * 2) > timeStamp) {
        return false;
      }

      return [data[1]];
    });
  }


  /**
   *
   * @param dataDir
   * @param ipcPath
   * @param protocol
   * @param extra
   * @returns {Array|Array.<T>|*}
   * @private
   */
  _setOptions ({dataDir, ipcPath, protocol = ['--shh', '--fast', '--cache', 512], extra = []} = {}) {
    this.options = [];
    if (!Array.isArray(protocol) || !Array.isArray(extra)) {
      throw new Error('protocol and extra options must be array type');
    }
    if (!dataDir) {
      dataDir = GethConnector.getDefaultDatadir();
    }
    this.dataDir = dataDir;

    if (!ipcPath) {
      ipcPath = path.join(this.dataDir, 'geth.ipc');
    }
    this.ipcPath = ipcPath;

    ipcPath = null;
    dataDir = null;

    this.options.push('--datadir', `${this.dataDir}`);

    this.options = this.options.concat(protocol, extra);
    return this.options;
  }

  /**
   *
   * @returns {*}
   */
  static getDefaultDatadir () {
    let dataDir;
    switch (platform) {
      case 'Linux':
        dataDir = path.join(os.homedir(), '.ethereum');
        break;
      case 'Darwin':
        dataDir = path.join(os.homedir(), 'Library', 'Ethereum');
        break;
      case 'Windows_NT':
        dataDir = path.join(process.env.APPDATA, '/Ethereum');
        break;
      default:
        throw new Error('Platform not supported');
    }
    return dataDir;
  }


  /**
   * Downloads geth executable
   * @returns {bluebird|exports|module.exports}
   * @private
   */
  _checkGeth () {

    return new Promise((resolve, reject) => {
      geth.run(['version'], function (err) {
        if (err) {
          reject(err);
        }
        resolve(geth.path());
      });
    });
  }

  /**
   *
   * @private
   */
  _ipcDestroy () {
    this.socket.destroy();
  }

  /**
   * Resolves promisses from ipcCall
   * @private
   */
  _setSocketEvents () {

    this.socket.on('connect', () => {
      this.logger.info('connection to ipc Established!');
    });

    this.socket.on('timeout', (e) => {
      this.logger.warn('connection to ipc timed out');
      this.socket.end('no activity on socket... closing connection');
    });

    this.socket.on('end', (e) => {
      this.logger.info('i/o to ipc ended');
    });

    this.socket.on('error', (error) => {
      this.logger.warn(error);
    });
  }

  /**
   *
   * @param extra
   * @returns {bluebird|exports|module.exports}
   * @private
   */
  _spawnGeth (extra) {
    return new Promise((resolve, reject) => {
      if (this.gethProcess) {
        return resolve(true);
      }

      this.gethProcess = childProcess.spawn(this.executable, this.options, extra);

      this.gethProcess.on('exit', (code, signal) => {
        this.logger.info('geth:spawn:exit:', code, signal);
      });

      this.gethProcess.on('close', (code, signal) => {
        this.logger.info('geth:spawn:close:', code, signal);
      });

      this.gethProcess.on('error', (code) => {
        this.logger.warn(`geth:spawn:error:${code}`);
        return reject(`geth:spawn:error:${code}`);
      });

      this.gethProcess.stderr.on('data', (data) => {
        this.logger.info(data.toString());
      });

      this.gethProcess.stdout.on('data', (data) => {
        this.logger.info(data.toString());
      });

      return resolve(true);
    });
  }
}

export default GethConnector;
