const path    = require('path');
const winston = require('winston');
const fs      = require('fs');

const symbolEnforcer = Symbol();
const symbol         = Symbol();


class AkashaLogger {

  /**
   *
   * @param userData
   * @param enforcer
   */
  constructor (userData, enforcer) {

    if (enforcer !== symbolEnforcer) {
      throw new Error('Cannot construct singleton');
    }

    if (!userData) {
      userData = process.cwd();
    }

    this.logPath = path.join(userData, 'logs');
    this.loggers = {};
    fs.access(this.logPath, fs.F_OK, (err)=> {
      if (err) {
        fs.mkdir(this.logPath, (error)=> {
          if (!error) {
            console.log(error);
          }
        });
      }
    });
  }

  /**
   *
   * @param userData
   * @returns {*}
   */
  static getInstance (userData) {
    if (!this[symbol]) {
      this[symbol] = new AkashaLogger(userData, symbolEnforcer);
    }
    return this[symbol];
  }

  /**
   *
   * @param name
   * @param maxsize
   * @param maxFiles
   * @returns {*}
   */
  registerLogger (name, {maxsize = 10 * 1024, maxFiles = 1} = {}) {
    this.loggers[name] = new (winston.Logger)({
      transports: [
        new winston.transports.Console({
          level:    'warn',
          colorize: true
        }),
        new (winston.transports.File)({
          filename: path.join(this.logPath, `${name}.log`),
          level:    'info',
          maxsize:  maxsize,
          maxFiles: maxFiles,
          name:     `log-${name}`
        })
      ]
    });
    return this.loggers[name];
  }

  /**
   *
   * @param name
   * @returns {*}
   */
  getLogger (name) {
    return this.loggers[name];
  }
}

export default AkashaLogger;


