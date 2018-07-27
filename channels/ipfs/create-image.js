"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.createImage = function createImage(data, type = 'image/jpg') {
    const blob = new Blob([data], { type });
    return URL.createObjectURL(blob);
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const requests = data.map((hash) => {
            return getService(constants_1.CORE_MODULE.IPFS_CONNECTOR)
                .getInstance().api.getFile(hash).then((uintData) => {
                return { data: uintData, hash };
            });
        });
        const collection = yield Promise.all(requests);
        const response = collection.map((record) => {
            return { [record.hash]: exports.createImage(record.data) };
        });
        return { collection: response };
    });
    const createImages = { execute, name: 'createImage' };
    const service = function () {
        return createImages;
    };
    sp().service(constants_1.IPFS_MODULE.createImage, service);
    return createImages;
}
exports.default = init;
//# sourceMappingURL=create-image.js.map