"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bs58 = require("bs58");
const ethereumjs_util_1 = require("ethereumjs-util");
const safe_buffer_1 = require("safe-buffer");
const constants_1 = require("./constants");
function init(sp) {
    const decodeHash = function (ipfsHash) {
        const decoded = bs58.decode(ipfsHash);
        const fn = decoded.slice(0, 1);
        const digestSize = decoded.slice(1, 2);
        const hash = decoded.slice(2);
        return [
            ethereumjs_util_1.addHexPrefix(hash.toString('hex')),
            ethereumjs_util_1.addHexPrefix(fn.toString('hex')),
            ethereumjs_util_1.addHexPrefix(digestSize.toString('hex')),
        ];
    };
    const encodeHash = function (fn, digestSize, hash) {
        const fnBuff = safe_buffer_1.Buffer.from(fn.toString(16), 'hex');
        const digestSizeBuff = safe_buffer_1.Buffer.from(digestSize.toString(16), 'hex');
        const hashBuff = safe_buffer_1.Buffer.from(ethereumjs_util_1.stripHexPrefix(hash), 'hex');
        const totalLength = fnBuff.length + digestSizeBuff.length + hashBuff.length;
        const decoded = safe_buffer_1.Buffer.concat([fnBuff, digestSizeBuff, hashBuff], totalLength);
        return bs58.encode(decoded);
    };
    const service = function () {
        return { decodeHash, encodeHash };
    };
    sp().service(constants_1.COMMON_MODULE.ipfsHelpers, service);
}
exports.default = init;
//# sourceMappingURL=ipfs-helpers.js.map