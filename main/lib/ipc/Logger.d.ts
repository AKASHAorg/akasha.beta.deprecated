declare class AppLogger {
    logPath: string;
    loggers: Object;
    PATH_OK: boolean;
    constructor(enforcer: Symbol);
    private _buildPath(path);
    static getInstance(): any;
    private _setLogsFolder(path);
    registerLogger(name: string, {level, errorLevel, maxsize, maxFiles}?: {
        level?: string;
        errorLevel?: string;
        maxsize?: number;
        maxFiles?: number;
    }): any;
    getLogger(name: string): any;
}
export default AppLogger;
