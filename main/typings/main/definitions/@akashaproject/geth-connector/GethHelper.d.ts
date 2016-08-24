import * as Promise from 'bluebird';
export declare class GethHelper {
    watcher: any;
    txQueue: Map<any, any>;
    syncing: boolean;
    watching: boolean;
    inSync(): Promise<any>;
    startTxWatch(): boolean;
    stopTxWatch(): any;
    addTxToWatch(tx: string, autoWatch?: boolean): this;
    getCurrentTxQueue(): IterableIterator<any>;
    hasKey(address: string): Promise<boolean>;
}
declare const helper: GethHelper;
export default helper;
