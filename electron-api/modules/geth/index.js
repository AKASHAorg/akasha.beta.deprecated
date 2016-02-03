/* eslint strict: 0 */
'use strict';

const winston      = require('winston');
const Promise      = require('bluebird');
const path         = require('path');
const childProcess = require('child_process');
const check        = require('check-types');
//const geth         = require('./geth');
const net          = require('net');

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
        filename: 'logs/geth.log',
        level:    'info',
        maxsize:  10 * 1024, //1MB
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
    this.executable = '/usr/bin/geth'; //geth.path(); stubbed for now

    this.ethConnector     = null;
    this.lastChunk        = null;
    this.lastChunkTimeout = null;

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
    this._spawnGeth({detached: true});
  }

  /**
   *
   * @param dataDir
   * @param protocol
   * @param cors
   * @param extra
   * @returns {Array}
   * @private
   */
  _setOptions ({dataDir, protocol=['--shh', '--rpc'], cors=['--rpccorsdomain', 'localhost'], extra=[]}={}) {
    if (!check.array(protocol) || !check.array(cors) || !check.array(extra)) {
      throw new Error('protocol, cors and extra options must be array type');
    }
    if (dataDir) {
      this.options.push(`--datadir ${dataDir}`);
    }

    this.options.push(protocol.join(' '), cors.join(' '), extra.join(' '));
    return this.options;
  }


  ipcCall (name, params, callback) {
    if (!this.ethConnector) {
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

    dechunkedData.forEach(function (chunk) {

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

  _connectToIPC () {
    if (!this.socket.writable) {
      this.socket.connect({path: path.join(this.config.dataDir, 'geth.ipc')});
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
      this.gethProcess = childProcess.spawn(this.executable, this.options, extra);
      this.gethProcess.on('exit', (code, signal) => {
        console.log('exit:', code, signal);
      });
      this.gethProcess.on('close', (code, signal) => {
        console.log('close:', code, signal);
      });
      this.gethProcess.on('error', (code) => {
        console.log('error:', code);
      });

      resolve('');//stubbed
    });
  }
}
;

module.exports = GethConnector;
