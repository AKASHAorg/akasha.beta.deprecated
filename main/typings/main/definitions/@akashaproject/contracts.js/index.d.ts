declare module '@akashaproject/contracts.js' {
    const contracts: {Class: any};
    export default contracts;
}

declare module 'ethereumjs-util' {
    export function ecsign(msgHash: string, privateKey: string): {r: string, s: string, v: string}
    export function ecrecover(msgHash: Buffer, v: string, r: string, s: string): Buffer
    export function fromRpcSig(sig: string): {r: string, s: string, v: string}
    export function isValidAddress(address: string): boolean
    export function toBuffer(data: any): Buffer
    export function bufferToHex(data: Buffer): string
    export function pubToAddress(pubKey: string, sanitize?: boolean): Buffer
}
