import * as Promise from 'bluebird';
import Wrapper = require('bin-wrapper');
export declare class IpfsBin {
    wrapper: Wrapper;
    constructor(target?: string);
    getPath(): string;
    check(): Promise<{}>;
    deleteBin(): Promise<{}>;
}
