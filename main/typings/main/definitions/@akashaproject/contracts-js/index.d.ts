declare module '@akashaproject/contracts.js';

declare module 'ethereumjs-util' {
    export function ecsign(msgHash: string, privateKey: string): { r: string, s: string, v: string };

    export function ecrecover(msgHash: Buffer, v: string, r: string, s: string): Buffer;

    export function fromRpcSig(sig: string): { r: string, s: string, v: string };

    export function isValidAddress(address: string): boolean;

    export function isValidChecksumAddress(address: string): boolean;

    export function toBuffer(data: any): Buffer;

    export function bufferToHex(data: Buffer): string;

    export function pubToAddress(pubKey: string, sanitize?: boolean): Buffer;

    export function unpad(data: Buffer | string): any;

    export function hashPersonalMessage(data: Buffer): Buffer;

    export function addHexPrefix(data: string): string;

    export function stripHexPrefix(data: string): string;
}


declare module 'ethereumjs-testrpc';
declare module 'spectron';
declare module 'compare-versions';
declare module 'electron-spellchecker';
declare module 'archiver';
declare module 'request';
declare module 'winston';
declare module 'ramda';
declare module 'object-hash';
declare module 'electron-updater';
