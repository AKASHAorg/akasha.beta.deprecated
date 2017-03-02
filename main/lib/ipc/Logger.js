"use strict";
const path_1 = require("path");
const winston_1 = require("winston");
const fs_1 = require("fs");
const electron_1 = require("electron");
const symbolEnforcer = Symbol();
const symbol = Symbol();
class AppLogger {
    constructor(enforcer) {
        if (enforcer !== symbolEnforcer) {
            throw new Error('Cannot construct singleton');
        }
        this.loggers = {};
        const defaultPath = path_1.join(electron_1.app.getPath('userData'), 'logs');
        fs_1.open(defaultPath, 'r', (err, fd) => {
            if (err) {
                if (err.code === "ENOENT") {
                    return this._buildPath(defaultPath);
                }
                throw err;
            }
            this._setLogsFolder(defaultPath);
            this.PATH_OK = true;
            return this.PATH_OK;
        });
    }
    _buildPath(path) {
        this._setLogsFolder(path);
        fs_1.mkdirSync(path);
        this.PATH_OK = true;
        return this.PATH_OK;
    }
    static getInstance() {
        if (!this[symbol]) {
            this[symbol] = new AppLogger(symbolEnforcer);
        }
        return this[symbol];
    }
    _setLogsFolder(path) {
        this.logPath = path;
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
                    maxsize,
                    maxFiles,
                    name: `${name}Error`,
                    tailable: true,
                    zippedArchive: true
                }),
                new (winston_1.transports.File)({
                    filename: path_1.join(this.logPath, `${name}.info.log`),
                    level,
                    maxsize,
                    maxFiles,
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