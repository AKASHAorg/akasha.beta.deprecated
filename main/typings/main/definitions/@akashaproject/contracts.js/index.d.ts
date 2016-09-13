declare module '@akashaproject/contracts.js' {
    const contracts: {Class: any};
    export default contracts;
    export const classes: any;
}

declare module 'ethereumjs-util' {
    export function ecsign(msgHash: string, privateKey: string): {r: string, s: string, v: string}
    export function ecrecover(msgHash: Buffer, v: string, r: string, s: string): Buffer
    export function fromRpcSig(sig: string): {r: string, s: string, v: string}
    export function isValidAddress(address: string): boolean
    export function toBuffer(data: any): Buffer
    export function bufferToHex(data: Buffer): string
    export function pubToAddress(pubKey: string, sanitize?: boolean): Buffer
    export function unpad(data: Buffer | string): Buffer | string
}

declare module 'spectron' {
    export const Application: any;
}

declare module 'ethereumjs-testrpc' {
    const exported: any;
    export = exported;
}
