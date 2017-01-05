"use strict";
const Promise = require('bluebird');
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const index_1 = require('../../contracts/index');
(function (ObjectType) {
    ObjectType[ObjectType["PROFILE"] = 1] = "PROFILE";
    ObjectType[ObjectType["ENTRY"] = 2] = "ENTRY";
    ObjectType[ObjectType["COMMENT"] = 3] = "COMMENT";
})(exports.ObjectType || (exports.ObjectType = {}));
var ObjectType = exports.ObjectType;
(function (OperationType) {
    OperationType[OperationType["ADD"] = 1] = "ADD";
    OperationType[OperationType["REMOVE"] = 2] = "REMOVE";
})(exports.OperationType || (exports.OperationType = {}));
var OperationType = exports.OperationType;
const execute = Promise.coroutine(function* (data) {
    let hashRoot;
    switch (data.type) {
        case ObjectType.PROFILE:
            const profileAddress = yield index_1.constructed.instance.registry.addressOf(data.id);
            hashRoot = yield index_1.constructed.instance.profile.getIpfs(profileAddress);
            break;
        case ObjectType.ENTRY:
            const entryEth = yield index_1.constructed.instance.entries.getEntry(data.id);
            hashRoot = entryEth.ipfsHash;
            break;
        case ObjectType.COMMENT:
            if (data.id.length !== 2 || !Array.isArray(data.id)) {
                throw new Error('Comments must provide [entryId, commentdId]');
            }
            const commentEth = yield index_1.constructed.instance.comments.getComment.apply(this, data.id);
            hashRoot = commentEth.ipfsHash;
            break;
        default:
            throw new Error('No known type specified');
    }
    const pin = yield Promise.fromCallback((cb) => {
        if (data.operation === OperationType.REMOVE) {
            return ipfs_connector_1.IpfsConnector.getInstance().api.apiClient.pin.rm(hashRoot, { recursive: true }, cb);
        }
        if (data.operation === OperationType.ADD) {
            return ipfs_connector_1.IpfsConnector.getInstance().api.apiClient.pin.add(hashRoot, { recursive: true }, cb);
        }
        throw new Error('Operation for pinning not specified');
    });
    return { pin, id: data.id };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'pin' };
//# sourceMappingURL=runner.js.map