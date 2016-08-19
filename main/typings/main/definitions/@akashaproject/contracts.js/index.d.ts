declare module '@akashaproject/contracts.js' {
    const contracts: {Class: any};
    export default contracts;
}

declare module 'ethereumjs-util' {
    export function ecsign(msgHash: string, privateKey: string): {r: string, s: string, v: string}
    export function ecrecover(msgHash: string, v: string, r: string, s: string): string
    export function fromRpcSig(sig: string): {r: string, s: string, v: string}
    export function isValidAddress(address: string): boolean
}
