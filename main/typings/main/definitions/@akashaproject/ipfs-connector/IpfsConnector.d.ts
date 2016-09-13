import * as Promise from 'bluebird';
import { IpfsApiHelper } from './IpfsApiHelper';
import { EventEmitter } from 'events';
export declare class IpfsConnector extends EventEmitter {
    private process;
    private downloadManager;
    options: {
        retry: boolean;
        apiAddress: string;
        args: string[];
        executable: string;
        extra: {
            env: any;
            detached: boolean;
        };
    };
    serviceStatus: {
        api: boolean;
        process: boolean;
    };
    private _callbacks;
    private logger;
    private _api;
    constructor(enforcer: Symbol);
    static getInstance(): IpfsConnector;
    api: IpfsApiHelper;
    setLogger(logger: {}): void;
    setBinPath(path: string): void;
    setConfig(option: string, value: string): void;
    setIpfsFolder(target: string): void;
    checkExecutable(): Promise<{}>;
    start(): Promise<boolean>;
    private _start();
    private _attachStartingEvents();
    private _flushStartingEvents();
    private _pipeStd();
    stop(signal?: string): this;
    private _init();
}
