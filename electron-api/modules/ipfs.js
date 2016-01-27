const winston      = require('winston');
const ipfsBin      = require('go-ipfs');
const ipfsAPI      = require('ipfs-api');
const Future       = require('fibers/future');
const path         = require('path');
const childProcess = Future.wrap(require('child_process'));

const symbolEnforcer = Symbol();
const symbol         = Symbol();


const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(
      {
        level: 'debug',
        name:  'debug-ipfs'
      }
    ),
    new (winston.transports.File)(
      {
        filename: 'logs/ipfs.log',
        level:    'error',
        name:     'log-ipfs'
      }
    )
  ]
});


module.exports = class IpfsConnector {

  constructor (enforcer) {
    if (enforcer !== symbolEnforcer) {
      throw new Error('Cannot construct singleton');
    }
    this.ipfsConnector = null;
    this.ipsProcess    = null;
    this.api           = null;
    this.sock          = '/ip4/127.0.0.1/tcp/5001';
  }

  static getInstance () {
    if (!this[symbol]) {
      this[symbol] = new IpfsConnector(symbolEnforcer).start();
    }
    return this[symbol];
  }

  /**
   * start ipfs
   * @returns {*}
   */
  start () {
    if (!this.ipfsConnector) {
      const future = new Future();
      if (config) {
        let options = {
          command: ipfsBin,
          args:    ['daemon']
        };

        this.ipfsConnector = childProcess.spawnFuture(options);

        if (this.ipfsConnector) {
          this._logEvents();
          future.return(true);
        } else {
          future.throw(true);
        }

      } else {
        log.error('error getting ipfs config');
        future.throw(true);
      }
      return future.wait();
    }
    return false;
  }

  _logEvents () {
    this.ipfsConnector.stdout.on('data', (data)=> {
      logger.debug(`stdout: ${data}`);
    });

    this.ipfsConnector.stderr.on('data', (data)=> {
      logger.debug(`stderr: ${data}`);
    });
  }

  /**
   * run <code>ipfs init</code>
   * @private
   */
  _initIpfs () {

    const future = new Future();

    let q = exec(this.executable + ' init');

    q.on('exit', ()=> {
      future.return(true);
    });

    q.on('error', (err)=> {
      future.throw(err);
    });
    return future.wait();
  }

  stop () {
    this._kill();
    this.ipfsConnector = null;
  }

  /**
   * kill child process & cleanup
   * @private
   */
  _kill () {
    this.ipfsProcess.kill();
  }

};
