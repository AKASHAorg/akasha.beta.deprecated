"use strict";
const path_1 = require('path');
const winston_1 = require('winston');
const fs_1 = require('fs');
const electron_1 = require('electron');
const symbolEnforcer = Symbol();
const symbol = Symbol();
class AppLogger {
    constructor(enforcer) {
        if (enforcer !== symbolEnforcer) {
            throw new Error('Cannot construct singleton');
        }
        this.loggers = {};
        const defaultPath = path_1.join(electron_1.app.getPath('userData'), 'logs');
        this._setLogsFolder(defaultPath);
    }
    static getInstance() {
        if (!this[symbol]) {
            this[symbol] = new AppLogger(symbolEnforcer);
        }
        return this[symbol];
    }
    _setLogsFolder(path) {
        this.logPath = path;
        return fs_1.access(this.logPath, fs_1.constants.W_OK, (err) => {
            if (err) {
                fs_1.mkdir(this.logPath, (error) => {
                    if (error) {
                        this.PATH_OK = false;
                        throw new Error(error.message);
                    }
                    this.PATH_OK = true;
                });
                return;
            }
            this.PATH_OK = true;
        });
    }
    registerLogger(name, { level = 'info', errorLevel = 'warn', maxsize = 10 * 1024, maxFiles = 1 } = {}) {
        if (!this.PATH_OK) {
            throw new Error(`${this.logPath} is not accessible`);
        }
        this.loggers[name] = new (winston_1.Logger)({
            transports: [
                new (winston_1.transports.File)({
                    filename: path_1.join(this.logPath, `${name}.error.log`),
                    level: errorLevel,
                    maxsize: maxsize,
                    maxFiles: maxFiles,
                    name: `${name}Error`,
                    tailable: true,
                    zippedArchive: true
                }),
                new (winston_1.transports.File)({
                    filename: path_1.join(this.logPath, `${name}.info.log`),
                    level: level,
                    maxsize: maxsize,
                    maxFiles: maxFiles,
                    name: `${name}Info`,
                    tailable: true,
                    zippedArchive: true
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
//# sourceMappingURL=Logger.js.map