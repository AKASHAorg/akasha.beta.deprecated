/* eslint strict: 0 */
'use strict';

const winston      = require('winston');
const ipfsBin      = require('go-ipfs');
const ipfsAPI      = require('ipfs-api');
const Future       = require('fibers/future');
const path         = require('path');
const childProcess = require('child_process');

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
 *    const ipfs = IpfsConnector.getInstance().start();
 *    ipfs.api.cat('ipfsHash', ....)
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
    this._sock       = '/ip4/127.0.0.1/tcp/5001';
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
  start () {
    if (!this.ipfsProcess) {
      const future = new Future();
      let options  = {
        command: ipfsBin,
        args:    ['daemon'],
        extra:   {
          env: process.env
        }
      };

      this.ipfsProcess = childProcess.spawn(options.command, options.args, options.extra);

      if (this.ipfsProcess && this._connectToAPI()) {
        this._logEvents();
        return future.return(true);

      } else if (this._retry && this._initIpfs()) {
        return this.start();

      } else {
        future.throw(true);

      }

      return future.wait();
    }
    return true;
  }

  stop () {
    this._kill("SIGINT");
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
    if (this.ipfsProcess) {
      this._api = ipfsAPI(this._sock);
      return true;
    }
    return false;
  }


  /**
   * Send process stream to logger
   * @returns {boolean}
   * @private
   */
  _logEvents () {
    this.ipfsProcess.stdout.on('data', (data)=> {
      logger.info(`ipfs:stdout: ${data}`);
    });

    this.ipfsProcess.stderr.on('data', (data)=> {
      logger.info(`ipfs:stderr: ${data}`);
    });

    return true;
  }

  /**
   * run <code>ipfs init</code>
   * @private
   */
  _initIpfs () {

    let future = new Future();

    let q = childProcess.execFuture(ipfsBin + ' init');

    q.on('exit', ()=> {
      future.return(true);
    });

    q.on('error', (err)=> {
      future.throw(err);
    });
    this._retry = false;
    return future.wait();
  }

  /**
   * kill child process & cleanup
   * @private
   */
  _kill (signal) {
    this.ipfsProcess.kill(signal);
    this._api = null;
  }

}
module.exports = IpfsConnector;
