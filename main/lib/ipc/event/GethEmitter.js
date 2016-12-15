"use strict";
const geth_connector_1 = require('@akashaproject/geth-connector');
const AbstractEmitter_1 = require('./AbstractEmitter');
const channels_1 = require('../../channels');
const responses_1 = require('./responses');
const index_1 = require('../contracts/index');
const index_2 = require('../modules/index');
class GethEmitter extends AbstractEmitter_1.AbstractEmitter {
    attachEmitters() {
        this._download()
            ._error()
            ._fatal()
            ._starting()
            ._started()
            ._stopped();
    }
    _download() {
        geth_connector_1.GethConnector.getInstance().on(geth_connector_1.CONSTANTS.DOWNLOADING_BINARY, () => {
            this.fireEvent(channels_1.default.client.geth.startService, responses_1.gethResponse({ downloading: true }));
        });
        return this;
    }
    _starting() {
        geth_connector_1.GethConnector.getInstance().on(geth_connector_1.CONSTANTS.STARTING, () => {
            this.fireEvent(channels_1.default.client.geth.startService, responses_1.gethResponse({ starting: true }));
        });
        return this;
    }
    _started() {
        geth_connector_1.GethConnector.getInstance().on(geth_connector_1.CONSTANTS.STARTED, () => {
            this.fireEvent(channels_1.default.client.geth.startService, responses_1.gethResponse({ started: true }));
        });
        geth_connector_1.GethConnector.getInstance().on(geth_connector_1.CONSTANTS.IPC_CONNECTED, () => {
            this.fireEvent(channels_1.default.client.geth.startService, responses_1.gethResponse({}));
            index_1.constructed.init(geth_connector_1.GethConnector.getInstance().web3);
            index_2.initModules();
        });
        return this;
    }
    _stopped() {
        geth_connector_1.GethConnector.getInstance().on(geth_connector_1.CONSTANTS.STOPPED, () => {
            this.fireEvent(channels_1.default.client.geth.stopService, responses_1.gethResponse({ stopped: true }));
        });
        return this;
    }
    _fatal() {
        geth_connector_1.GethConnector.getInstance().on(geth_connector_1.CONSTANTS.FATAL, (message) => {
            this.fireEvent(channels_1.default.client.geth.startService, responses_1.gethResponse({}, { message, fatal: true }));
        });
        return this;
    }
    _error() {
        geth_connector_1.GethConnector.getInstance().on(geth_connector_1.CONSTANTS.ERROR, (message) => {
            this.fireEvent(channels_1.default.client.geth.startService, responses_1.gethResponse({}, { message }));
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GethEmitter;
//# sourceMappingURL=GethEmitter.js.map