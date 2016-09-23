import * as Promise from 'bluebird';
export declare class IpfsApiHelper {
    apiClient: any;
    OBJECT_MAX_SIZE: number;
    REQUEST_TIMEOUT: number;
    LINK_SYMBOL: string;
    constructor(provider: any);
    add(data: Object | Buffer): any;
    addFile(dataBuffer: Buffer): any;
    get(objectHash: string): any;
    getObject(objectHash: string): any;
    getFile(hash: string): Promise<{}>;
    private _getStats(objectHash);
    updateObject(hash: string, newData: Object): any;
    resolve(path: any): any;
    constructObjLink(data: any): any;
}
