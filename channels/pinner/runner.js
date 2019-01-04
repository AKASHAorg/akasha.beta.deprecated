"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const ethereumjs_util_1 = require("ethereumjs-util");
var objectType;
(function (objectType) {
    objectType[objectType["PROFILE"] = 1] = "PROFILE";
    objectType[objectType["ENTRY"] = 2] = "ENTRY";
    objectType[objectType["COMMENT"] = 3] = "COMMENT";
})(objectType = exports.objectType || (exports.objectType = {}));
var operationType;
(function (operationType) {
    operationType[operationType["ADD"] = 1] = "ADD";
    operationType[operationType["REMOVE"] = 2] = "REMOVE";
})(operationType = exports.operationType || (exports.operationType = {}));
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        let hashRoot;
        switch (data.type) {
            case objectType.PROFILE:
                const profileHex = yield (getService(constants_1.CORE_MODULE.CONTRACTS))
                    .instance.ProfileResolver.reverse(data.id);
                if (!!ethereumjs_util_1.unpad(profileHex)) {
                    const [, , , fn, digestSize, hash] = yield (getService(constants_1.CORE_MODULE.CONTRACTS))
                        .instance.ProfileResolver.resolve(profileHex);
                    hashRoot = getService(constants_1.COMMON_MODULE.ipfsHelpers)
                        .encodeHash(fn, digestSize, hash);
                }
                break;
            case objectType.ENTRY:
                const [fnE, digestSizeE, hashE] = yield (getService(constants_1.CORE_MODULE.CONTRACTS))
                    .instance.Entries.getEntry(data.id.ethAddress, data.id.entryId);
                hashRoot = (getService(constants_1.COMMON_MODULE.ipfsHelpers))
                    .encodeHash(fnE, digestSizeE, hashE);
                break;
            case objectType.COMMENT:
                const [, , , , fnC, digestSizeC, hashC] = yield (getService(constants_1.CORE_MODULE.CONTRACTS))
                    .instance.Comments.getComment(data.id.entryId, data.id.commentId);
                hashRoot = (getService(constants_1.COMMON_MODULE.ipfsHelpers))
                    .encodeHash(fnC, digestSizeC, hashC);
                break;
            default:
                throw new Error('No known type specified');
        }
        const pin = yield Promise.fromCallback((cb) => {
            if (data.operation === operationType.REMOVE) {
                return (getService(constants_1.CORE_MODULE.IPFS_CONNECTOR))
                    .getInstance().api.apiClient.pin.rm(hashRoot, { recursive: true }, cb);
            }
            if (data.operation === operationType.ADD) {
                return (getService(constants_1.CORE_MODULE.IPFS_CONNECTOR))
                    .getInstance().api.apiClient.pin.add(hashRoot, { recursive: true }, cb);
            }
            throw new Error('Operation for pinning not specified');
        });
        return { pin, id: data.id };
    });
    const pin = { execute, name: 'pin' };
    const service = function () {
        return pin;
    };
    sp().service(constants_1.PINNER_MODULE.pin, service);
    return pin;
}
exports.default = init;
//# sourceMappingURL=runner.js.map