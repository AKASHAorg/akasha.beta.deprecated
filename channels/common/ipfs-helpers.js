import * as bs58 from 'bs58';
import { addHexPrefix, stripHexPrefix } from 'ethereumjs-util';
import { Buffer } from 'safe-buffer';
import { COMMON_MODULE } from './constants';
export default function init(sp) {
    const decodeHash = function (ipfsHash) {
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
    const encodeHash = function (fn, digestSize, hash) {
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
//# sourceMappingURL=ipfs-helpers.js.map