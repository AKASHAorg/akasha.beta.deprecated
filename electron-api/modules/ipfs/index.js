/* eslint strict: 0 */
'use strict';

const winston      = require('winston');
const ipfsBin      = require('go-ipfs');
const ipfsAPI      = require('ipfs-api');
const Promise      = require('bluebird');
const path         = require('path');
const childProcess = require('child_process');
const check        = require('check-types');

const symbolEnforcer = Symbol();
const symbol         = Symbol();

const env = process.env.NODE_ENV || 'development';

const logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({
      level:    'warn',
      colorize: true
    }),
    new (winston.transports.File)(
      {
        filename: 'logs/ipfs.log',
        level:    'info',
        maxsize:  10 * 1024, //1MB
        maxFiles: 1,
        name:     'log-ipfs'
      }
    )
  ]
});

/**
 * Quick usage:
 *    const ipfs = IpfsConnector.getInstance();
 *    ipfs.start();
 *    ipfs.api.cat('ipfsHash', ....)
 *    ipfs.stop(); //must be explicit @Todo: bind ipfs.stop() to main process exit
 */
class IpfsConnector {

  /**
   * Prevent multiple instances of IpfsConnector
   * @param enforcer
   */
  constructor (enforcer) {
    if (enforcer !== symbolEnforcer) {
      throw new Error('Cannot construct singleton');
    }
    this.ipfsProcess = null;
    this._api        = null;
    this._conn       = '/ip4/127.0.0.1/tcp/5001';
    this._retry      = true;
  }

  /**
   * Get singleton instance
   * @returns {object}
   */
  static getInstance () {
    if (!this[symbol]) {
      this[symbol] = new IpfsConnector(symbolEnforcer);
    }
    return this[symbol];
  }


  /**
   * start ipfs
   * @returns {bool}
   */
  start ({daemon=true, unixSock=true}={}) {

    let options = {
      command: ipfsBin,
      args:    ['daemon'],
      extra:   {
        env:      process.env,
        detached: true
      }
    };
    if (daemon) {
      this._spawnIPFS(options).then(
        (data) => {
          logger.info(`ipfs:start: ${data}`);
        }
      ).catch(
        (err) => {
          if (this._retry) {
            return this._initIpfs().then(
              (data) => {
                this.start();
              }
            ).catch(
              (errInit) => {
                logger.warn(`ipfs:${errInit}`);
              }
            );
          }
          return logger.warn(err);
        }
      );
    }

    this._connectToAPI();
  }

  /**
   * Set connection to api server
   * Must be done before start()
   * @param socket
   * @param rpc
   * @returns {IpfsConnector}
   */
  setSchema ({socket, rpc={host: 'localhost', port: '5001', procotol: 'http'}}={}) {
    if (socket) {
      this._conn = socket;
    } else {
      this._conn = rpc;
    }
    return this;
  }

  stop () {
    this._kill('SIGINT');
    this.ipfsProcess = null;
  }

  /**
   * Send api calls to server
   * @returns {null|object}
   */
  get api () {
    return this._api;
  }

  /**
   * Connect to ipfs api server
   * @returns {boolean}
   * @private
   */
  _connectToAPI () {
    this._api = ipfsAPI(this._conn);
  }

  /**
   * Spawn daemon process
   * @param options
   * @returns {bluebird|exports|module.exports}
   * @private
   */
  _spawnIPFS (options) {
    return new Promise((resolve, reject) => {
      this.ipfsProcess = childProcess.spawn(options.command, options.args, options.extra);
      this.ipfsProcess.once('exit', (code, signal) => {
        if (code !== 0 && !signal) {
          return reject('could not start ipfs');
        }
        return resolve(this.ipfsProcess);
      });
      this._logEvents();
    });
  }


  /**
   * Send process stream to logger
   * @returns {boolean}
   * @private
   */
  _logEvents () {
    this.ipfsProcess.stdout.on('data', (data) => {
      logger.info(`ipfs:stdout: ${data}`);
    });

    this.ipfsProcess.stderr.on('data', (data) => {
      logger.info(`ipfs:stderr: ${data}`);
    });

    return true;
  }

  /**
   * run <code>ipfs init</code>
   * @private
   */
  _initIpfs () {
    return new Promise((resolve, reject) => {
      let q = childProcess.exec(ipfsBin + ' init');

      q.once('exit', (code, signal) => {
        if (code !== 0 && !signal) {
          return reject('already init');
        }
        return resolve(q);
      });

      this._retry      = false;
      this.ipfsProcess = null;
    });
  }

  /**
   * kill child process & cleanup
   * @private
   */
  _kill (signal) {
    check.nonEmptyString(signal);
    if (this.ipfsProcess) {
      this.ipfsProcess.kill(signal);
    }
    this._api = null;
  }

}
module.exports = IpfsConnector;
