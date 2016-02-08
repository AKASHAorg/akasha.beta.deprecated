/* eslint strict: 0 */
'use strict';

const winston      = require('winston');
const Promise      = require('bluebird');
const path         = require('path');
const childProcess = require('child_process');
const check        = require('check-types');
const geth         = require('./geth');
const net          = require('net');
const os           = require('os');

const platform = os.type();

const symbolEnforcer = Symbol();
const symbol         = Symbol();

const env   = process.env.NODE_ENV || 'development';
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
        maxsize:  10 * 1024 * 2, //2MB
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

    this.ipcCallbacks = {};
    this.options      = [];

    this._setSocketEvents();
  }

  static getInstance () {
    if (!this[symbol]) {
      this[symbol] = new GethConnector(symbolEnforcer);
    }
    return this[symbol];
  }

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
   *
   * @param dataDir
   * @param protocol
   * @param extra
   * @returns {Array}
   * @private
   */
  _setOptions ({dataDir, protocol=['--shh', '--rpc'], extra=[]}={}) {
    this.options = [];
    if (!check.array(protocol) || !check.array(extra)) {
      throw new Error('protocol, cors and extra options must be array type');
    }
    if (!dataDir) {
      switch (platform) {
        case 'Linux':
          dataDir = path.join(os.homedir(), '.ethereum');
          break;
        case 'Darwin':
          dataDir = path.join(os.homedir(), 'Library', 'Ethereum');
          break;
        case 'Windows_NT':
          dataDir = '%APPDATA%/Ethereum';
          break;
        default:
          logger.warn('geth:platform not supported');
          throw new Error('Platform not supported');
      }
    }
    this.dataDir = dataDir;

    this.options.push('--datadir', `${this.dataDir}`);

    this.options = this.options.concat(protocol, extra);
    return this.options;
  }


  ipcCall (name, params, callback) {
    if (!this.gethProcess) {
      let msg = 'geth process not started, use .start() before';
      logger.warn(msg);
      callback(msg, null);
    }

    this._connectToIPC();
    if (this.socket.writable) {
      this.ipcCallbacks[idCount] = callback;
      this.socket.write(JSON.stringify({
        jsonrpc: '2.0',
        id:      idCount,
        method:  name,
        params:  params || []
      }));

      idCount++;
    } else {
      callback('Socket not writeable', null);
    }
  }

  _deChunker (data, callback) {
    data              = data.toString();
    let dechunkedData = data
      .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
      .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
      .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
      .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
      .split('|--|');

    dechunkedData.forEach((chunk)=> {

      if (this.lastChunk) {
        chunk = this.lastChunk + chunk;
      }

      let result = chunk;

      try {
        result = JSON.parse(result);
      } catch (e) {
        this.lastChunk = chunk;
        clearTimeout(this.lastChunkTimeout);
        this.lastChunkTimeout = setTimeout(function () {
          callback('Couldn\'t decode data: ' + chunk);
        }, 1000 * 15);
        return;
      }

      clearTimeout(this.lastChunkTimeout);
      this.lastChunk = null;

      callback(null, result);
    });
  }

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

  _connectToIPC () {
    if (!this.socket.writable) {
      this.socket.connect({path: path.join(this.dataDir, 'geth.ipc')});
    }
  }

  _ipcDestroy () {
    this.socket.destroy();
  }

  _setSocketEvents () {

    this.socket.on('data', (data)=> {
      this._deChunker(data, (error, response)=> {
        if (!error) {
          let cb = this.ipcCallbacks[response.id];
          if (response.result) {
            cb(null, response.result);
          } else {
            cb(response.error, null);
          }
          delete this.ipcCallbacks[response.id];
        }
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

  stop () {
    if (this.gethProcess) {
      this.gethProcess.kill();
      this.socket.destroy();
      this.gethProcess = null;
    }
  }
}


module.exports = GethConnector;
