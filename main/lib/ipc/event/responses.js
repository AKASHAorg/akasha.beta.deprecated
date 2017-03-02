"use strict";
const geth_connector_1 = require("@akashaproject/geth-connector");
const ipfs_connector_1 = require("@akashaproject/ipfs-connector");
exports.gethResponse = (data, error) => {
    const api = geth_connector_1.GethConnector.getInstance().serviceStatus;
    const status = Object.assign(data, { api: api.api, spawned: api.process });
    return { data: status, error };
};
exports.ipfsResponse = (data, error) => {
    const status = ipfs_connector_1.IpfsConnector.getInstance().serviceStatus;
    const merged = Object.assign(data, { api: status.api, spawned: status.process });
    return { data: merged, error };
};
exports.mainResponse = (rawData) => {
    if (rawData.error) {
        return { data: {}, error: { message: rawData.error.message, from: rawData.from } };
    }
    return { data: rawData };
};
//# sourceMappingURL=responses.js.map