/// <reference types="bluebird" />
/// <reference types="node" />
import * as Promise from 'bluebird';
export declare const randomBytesAsync: (arg1: number) => Promise<Buffer>;
export default class Auth {
    private _encrypted;
    private _decipher;
    private _cipher;
    private _session;
    private _task;
    generateKey(pass: any): any;
    private _generateRandom();
    private _encrypt(key);
    private _read(token);
    login(acc: string, pass: any | Uint8Array, timer?: number, registering?: boolean): any;
    logout(): void;
    isLogged(token: any): boolean;
    private _flushSession();
    private _signSession(account, hash);
    signData(data: {}, token: string): any;
}
