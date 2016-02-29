/* eslint strict: 0 */
'use strict';

const winston      = require('winston');
const Promise      = require('bluebird');
const path         = require('path');
const childProcess = require('child_process');
const geth         = require('./geth');
const net          = require('net');
const os           = require('os');

const platform = os.type();

const symbolEnforcer = Symbol();
const symbol         = Symbol();

// const env   = process.env.NODE_ENV || 'development';
let idCount = 1;

const logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({
      level:    'warn',
      colorize: true
    }),
    new (winston.transports.File)(
    {
      filename: 'logs/geth.log',
      level:    'info',
      maxsize:  10 * 1024 * 2, // 2MB
      maxFiles: 1,
      name:     'log-geth'
    }
    )
  ]
});


class GethConnector {

  /**
   *
   * @param enforcer
   */
  constructor (enforcer) {
    if (enforcer !== symbolEnforcer) {
      throw new Error('Cannot construct singleton');
    }

    this.socket     = new net.Socket();
    this.executable = null;

    this.gethProcess      = null;
    this.lastChunk        = null;
    this.lastChunkTimeout = null;
    this.dataDir          = null;
    this.ipcPath          = null;

    this.ipcCallbacks = {};
    this.options      = [];

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

    this._checkGeth().then((binary)=> {
      this.executable = binary;
      return this._spawnGeth({detached: true}).then(function (data) {
        return data;
      }).catch(function (err) {
        throw new Error(`Could not start geth ${err}`);
      });
    }).catch((err)=> {
      logger.warn(`geth:binary:${err}`);
      throw new Error(`Could not download geth ${err}`);
    });
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
   * Call geth ipc methods
   * @param name
   * @param params
   * @returns {bluebird|exports|module.exports}
   */
  ipcCall (name, params = []) {
    let msg;

    return new Promise((send, deny)=> {
      if (!this.gethProcess) {
        msg = 'geth process not started, use .start() before';
        logger.warn(msg);
        return deny(msg);
      }
      this._connectToIPC();
      if (!this.socket.writable) {
        return deny('Socket not writeable');
      }
      this.ipcCallbacks[idCount] = {resolve: send, reject: deny};
      this.socket.write(JSON.stringify({
        jsonrpc: '2.0',
        id:      idCount,
        method:  name,
        params:  params || []
      }));
      return idCount++;
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
  _setOptions ({dataDir, ipcPath, protocol = ['--shh', '--rpc', '--fast', '--cache', 512], extra = []} = {}) {
    this.options = [];
    if (!Array.isArray(protocol) || !Array.isArray(extra)) {
      throw new Error('protocol, cors and extra options must be array type');
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
        dataDir = process.env.APPDATA + '/Ethereum';
        break;
      default:
        logger.warn('geth:platform not supported');
        throw new Error('Platform not supported');
    }
    return dataDir;
  }

  /**
   * Construct data from ipc stream
   * @param data
   * @returns {bluebird|exports|module.exports}
   * @private
   */
  _deChunker (data) {
    let result;
    let dechunkedData;

    return new Promise((resolve, reject)=> {

      data          = data.toString();
      dechunkedData = data
        .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
        .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
        .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
        .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
        .split('|--|');

      dechunkedData.forEach((chunk)=> {

        if (this.lastChunk) {
          chunk = this.lastChunk + chunk;
        }

        result = chunk;

        try {
          result = JSON.parse(result);
        } catch (e) {
          this.lastChunk = chunk;
          clearTimeout(this.lastChunkTimeout);
          this.lastChunkTimeout = setTimeout(function () {
            return reject('Couldn\'t decode data: ' + chunk);
          }, 1000 * 15);
          return;
        }

        clearTimeout(this.lastChunkTimeout);
        this.lastChunk = null;

        resolve(result);
      });
    });

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
   * Connect to geth ipc
   * @private
   */
  _connectToIPC () {
    if (!this.socket.writable) {
      this.socket.connect({path: this.ipcPath});
    }
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
    let promise;
    let err;
    this.socket.on('data', (data)=> {
      this._deChunker(data).then((resp)=> {
        promise = this.ipcCallbacks[resp.id];
        delete this.ipcCallbacks[resp.id];
        if (!resp.result) {
          return promise.reject(resp.error);
        }
        return promise.resolve(resp.result);
      }).catch(function (error) {
        err = `geth:ipcCall: ${error}`;
        logger.warn(err);
        throw new Error(err);
      });
    });

    this.socket.on('connect', function () {
      logger.info('connection to ipc Established!');
    });

    this.socket.on('timeout', (e)=> {
      logger.warn('connection to ipc timed out');
      this._ipcDestroy();
    });

    this.socket.on('end', (e)=> {
      logger.info('i/o to ipc ended');
    });

    this.socket.on('error', function (error) {
      logger.warn(error);
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
        logger.info('geth:spawn:exit:', code, signal);
      });

      this.gethProcess.on('close', (code, signal) => {
        logger.info('geth:spawn:close:', code, signal);
      });

      this.gethProcess.on('error', (code) => {
        return reject(`geth:spawn:error:${code}`);
      });

      this.gethProcess.stderr.on('data', function (data) {
        logger.info(data.toString());
      });

      this.gethProcess.stdout.on('data', function (data) {
        logger.info(data.toString());
      });

      return resolve(true);
    });
  }
}


module.exports = GethConnector;
