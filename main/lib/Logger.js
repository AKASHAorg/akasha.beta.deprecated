"use strict";
const path_1 = require('path');
const winston_1 = require('winston');
const fs_1 = require('fs');
const symbolEnforcer = Symbol();
const symbol = Symbol();
class AppLogger {
    constructor(userData, enforcer) {
        if (enforcer !== symbolEnforcer) {
            throw new Error('Cannot construct singleton');
        }
        if (!userData) {
            userData = process.cwd();
        }
        this.loggers = {};
        const defaultPath = path_1.join(userData, 'logs');
        this._setLogsFolder(defaultPath);
    }
    static getInstance(userData) {
        if (!this[symbol]) {
            this[symbol] = new AppLogger(userData, symbolEnforcer);
        }
        return this[symbol];
    }
    _setLogsFolder(path) {
        this.logPath = path;
        return fs_1.access(this.logPath, fs_1.W_OK, (err) => {
            if (err) {
                return fs_1.mkdir(this.logPath, (error) => {
                    if (error) {
                        this.PATH_OK = false;
                    }
                });
            }
            return this.PATH_OK = true;
        });
    }
    registerLogger(name, { level = 'info', consoleLevel = 'warn', maxsize = 10 * 1024, maxFiles = 1 } = {}) {
        if (!this.PATH_OK) {
            throw new Error(`${this.logPath} is not accessible`);
        }
        this.loggers[name] = new (winston_1.Logger)({
            transports: [
                new winston_1.transports.Console({
                    level: consoleLevel,
                    colorize: true
                }),
                new (winston_1.transports.File)({
                    filename: path_1.join(this.logPath, `${name}.log`),
                    level: level,
                    maxsize: maxsize,
                    maxFiles: maxFiles,
                    name: `log-${name}`
                })
            ]
        });
        return this.loggers[name];
    }
    getLogger(name) {
        return this.loggers[name];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppLogger;
