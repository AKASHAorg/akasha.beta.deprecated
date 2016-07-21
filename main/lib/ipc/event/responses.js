"use strict";
const geth_connector_1 = require('@akashaproject/geth-connector');
exports.gethResponse = (data, error) => {
    const api = geth_connector_1.GethConnector.getInstance().serviceStatus;
    const status = Object.assign(data, { api: api.api, spawned: api.process });
    return { data: status, error: error };
};
//# sourceMappingURL=responses.js.map