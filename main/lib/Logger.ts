import { join as pathJoin } from 'path';
import { Logger, transports } from 'winston';
import { W_OK, access as fsAccess, mkdir } from 'fs';

const symbolEnforcer = Symbol();
const symbol = Symbol();

class AppLogger {
    public logPath: string;
    public loggers: Object;
    public PATH_OK: boolean;

    /**
     *
     * @param userData      Folder target for logs
     * @param enforcer
     */
    constructor(userData: string, enforcer: Symbol) {
        if (enforcer !== symbolEnforcer) {
            throw new Error('Cannot construct singleton');
        }

        if (!userData) {
            userData = process.cwd();
        }
        this.loggers = {};
        const defaultPath = pathJoin(userData, 'logs');
        this._setLogsFolder(defaultPath);
    }

    /**
     *
     * @param userData
     * @returns {*}
     */
    static getInstance(userData: string) {
        if (!this[symbol]) {
            this[symbol] = new AppLogger(userData, symbolEnforcer);
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
        return fsAccess(this.logPath, W_OK, (err) => {
            if (err) {
                return mkdir(this.logPath, (error) => {
                    if (error) {
                        this.PATH_OK = false;
                    }
                });
            }
            return this.PATH_OK = true;
        });
    }

    /**
     *
     * @param name
     * @param level
     * @param consoleLevel
     * @param maxsize
     * @param maxFiles
     * @returns {any}
     */
    registerLogger(name: string, {
        level = 'info',
        consoleLevel = 'warn',
        maxsize = 10 * 1024,
        maxFiles = 1
    } = {}) {
        if (!this.PATH_OK) {
            throw new Error(`${this.logPath} is not accessible`);
        }
        this.loggers[name] = new (Logger)({
            transports: [
                new transports.Console({
                    level: consoleLevel,
                    colorize: true
                }),
                new (transports.File)({
                    filename: pathJoin(this.logPath, `${name}.log`),
                    level,
                    maxsize,
                    maxFiles,
                    name: `log-${name}`
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
