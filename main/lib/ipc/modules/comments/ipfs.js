"use strict";
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const records_1 = require('../models/records');
function create(data) {
    const date = (new Date()).toJSON();
    const constructed = {
        content: data,
        date
    };
    return ipfs_connector_1.IpfsConnector.getInstance().api
        .add(constructed)
        .then((result) => result.hash);
}
exports.create = create;
function getCommentContent(hash) {
    if (records_1.comments.getFull(hash)) {
        return Promise.resolve(records_1.comments.getFull(hash));
    }
    return ipfs_connector_1.IpfsConnector.getInstance().api
        .get(hash)
        .then((data) => {
        records_1.comments.setFull(hash, data);
        return data;
    });
}
exports.getCommentContent = getCommentContent;
//# sourceMappingURL=ipfs.js.map