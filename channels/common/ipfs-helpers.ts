import * as bs58 from 'bs58';
import { addHexPrefix, stripHexPrefix } from 'ethereumjs-util';
import { Buffer } from 'safe-buffer';
import { COMMON_MODULE } from './constants';

export default function init(sp) {
  // takes an ipfs hash like QmVSzbxYSvztu2YRfEDGjeGR7J7coTQhBR83DYRBXSoWyn
  // transforms it into [0x12, 0x20, 0x69a1c99d0af1da500ff363069c4e8c819c518bde34b3d6f8063cd6361eb4fdf1]
  const decodeHash = function (ipfsHash: string): string[] {
    const decoded = bs58.decode(ipfsHash);
    const fn = decoded.slice(0, 1);
    const digestSize = decoded.slice(1, 2);
    const hash = decoded.slice(2);
    return [
      addHexPrefix(hash.toString('hex')),
      addHexPrefix(fn.toString('hex')),
      addHexPrefix(digestSize.toString('hex')),
    ];
  };

  // reverse operation of decode
  // used for data from web3 contracts, hex encoded
  const encodeHash = function (fn: any, digestSize: any, hash: string): string {
    const fnBuff = Buffer.from(fn.toString(16), 'hex');
    const digestSizeBuff = Buffer.from(digestSize.toString(16), 'hex');
    const hashBuff = Buffer.from(stripHexPrefix(hash), 'hex');
    const totalLength = fnBuff.length + digestSizeBuff.length + hashBuff.length;
    const decoded = Buffer.concat([fnBuff, digestSizeBuff, hashBuff], totalLength);

    return bs58.encode(decoded);
  };

  const service = function () {
    return { decodeHash, encodeHash };
  };
  sp().service(COMMON_MODULE.ipfsHelpers, service);
}
