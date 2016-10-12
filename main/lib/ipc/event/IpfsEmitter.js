"use strict";
const AbstractEmitter_1 = require('./AbstractEmitter');
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const responses_1 = require('./responses');
const index_1 = require('../modules/index');
const channels_1 = require('../../channels');
class IpfsEmitter extends AbstractEmitter_1.AbstractEmitter {
    attachEmitters() {
        this._download()
            ._catchCorrupted()
            ._catchFailed()
            ._catchError()
            ._started()
            ._stopped();
    }
    _download() {
        ipfs_connector_1.IpfsConnector.getInstance().once(ipfs_connector_1.ipfsEvents.DOWNLOAD_STARTED, () => {
            this.fireEvent(channels_1.default.client.ipfs.startService, responses_1.ipfsResponse({ downloading: true }));
        });
        return this;
    }
    _started() {
        ipfs_connector_1.IpfsConnector.getInstance().on(ipfs_connector_1.ipfsEvents.SERVICE_STARTED, () => {
            this.fireEvent(channels_1.default.client.ipfs.startService, responses_1.ipfsResponse({ started: true }));
            index_1.initIpfsModules();
        });
        return this;
    }
    _stopped() {
        ipfs_connector_1.IpfsConnector.getInstance().on(ipfs_connector_1.ipfsEvents.SERVICE_STOPPED, () => {
            this.fireEvent(channels_1.default.client.ipfs.stopService, responses_1.ipfsResponse({ stopped: true }));
        });
        return this;
    }
    _catchCorrupted() {
        ipfs_connector_1.IpfsConnector.getInstance().on(ipfs_connector_1.ipfsEvents.BINARY_CORRUPTED, (err) => {
            this.fireEvent(channels_1.default.client.ipfs.startService, responses_1.ipfsResponse({}, { message: err.message, fatal: true }));
        });
        return this;
    }
    _catchFailed() {
        ipfs_connector_1.IpfsConnector.getInstance().on(ipfs_connector_1.ipfsEvents.SERVICE_FAILED, (err) => {
            this.fireEvent(channels_1.default.client.ipfs.startService, responses_1.ipfsResponse({}, { message: err.message, fatal: true }));
        });
        return this;
    }
    _catchError() {
        ipfs_connector_1.IpfsConnector.getInstance().on(ipfs_connector_1.ipfsEvents.ERROR, (message) => {
            this.fireEvent(channels_1.default.client.ipfs.startService, responses_1.ipfsResponse({}, { message }));
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IpfsEmitter;
//# sourceMappingURL=IpfsEmitter.js.map