import { join as pathJoin } from 'path';
import { Logger, transports } from 'winston';
import { mkdirSync, open } from 'fs';
import { app } from 'electron';

const symbolEnforcer = Symbol();
const symbol = Symbol();

class AppLogger {
    public logPath: string;
    public loggers: Object;
    public PATH_OK: boolean;

    /**
     *
     * @param enforcer
     */
    constructor(enforcer: Symbol) {
        if (enforcer !== symbolEnforcer) {
            throw new Error('Cannot construct singleton');
        }
        this.loggers = {};
    }
    public init() {
        return new Promise((resolve, reject) => {
            const defaultPath = pathJoin(app.getPath('userData'), 'logs');
            open(defaultPath, 'r', (err, fd) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        return resolve(this._buildPath(defaultPath));
                    }
                    return reject(err);
                }
                this._setLogsFolder(defaultPath);
                this.PATH_OK = true;
                return resolve(this.PATH_OK);
            });
        });
    }

    private _buildPath(path) {
        this._setLogsFolder(path);
        mkdirSync(path);
        this.PATH_OK = true;
        return this.PATH_OK;
    }

    /**
     *
     * @returns {*}
     */
    static getInstance() {
        if (!this[symbol]) {
            this[symbol] = new AppLogger(symbolEnforcer);
        }
        return this[symbol];
    }

    /**
     *
     * @param path
     * @private
     */
    private _setLogsFolder(path: string) {
        this.logPath = path;
    }

    /**
     *
     * @param name
     * @param level
     * @param errorLevel
     * @param maxsize
     * @param maxFiles
     * @returns {any}
     */
    registerLogger(name: string, {
        level = 'info',
        errorLevel = 'warn',
        maxsize = 10 * 1024,
        maxFiles = 1
    } = {}) {
        if (!this.PATH_OK) {
            throw new Error(`${this.logPath} is not accessible`);
        }
        this.loggers[name] = new (Logger)({
            transports: [
                new (transports.File)({
                    filename: pathJoin(this.logPath, `${name}.error.log`),
                    level: errorLevel,
                    maxsize,
                    maxFiles,
                    name: `${name}Error`,
                    tailable: true,
                    zippedArchive: true
                }),
                new (transports.File)({
                    filename: pathJoin(this.logPath, `${name}.info.log`),
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

    /**
     *
     * @param name
     * @returns {*}
     */
    getLogger(name: string) {
        return this.loggers[name];
    }
}

export default AppLogger;
