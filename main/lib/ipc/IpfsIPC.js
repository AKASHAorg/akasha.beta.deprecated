"use strict";
const IpfsEmitter_1 = require('./event/IpfsEmitter');
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const Logger_1 = require('./Logger');
const channels_1 = require('../channels');
const responses_1 = require('./event/responses');
class IpfsIPC extends IpfsEmitter_1.default {
    constructor() {
        super();
        this.logger = 'ipfs';
        this.DEFAULT_MANAGED = ['startService', 'stopService', 'status', 'resolve'];
        this.attachEmitters();
    }
    initListeners(webContents) {
        ipfs_connector_1.IpfsConnector.getInstance().setLogger(Logger_1.default.getInstance().registerLogger(this.logger));
        this.webContents = webContents;
        this._start()
            ._stop()
            ._status()
            ._resolve()
            ._manager();
    }
    _start() {
        this.registerListener(channels_1.default.server.ipfs.startService, (event) => {
            ipfs_connector_1.IpfsConnector.getInstance().start();
        });
        return this;
    }
    _stop() {
        this.registerListener(channels_1.default.server.ipfs.stopService, (event, data) => {
            ipfs_connector_1.IpfsConnector.getInstance().stop(data.signal);
        });
        return this;
    }
    _manager() {
        this.registerListener(channels_1.default.server.ipfs.manager, (event, data) => {
            if (data.listen) {
                if (this.getListenersCount(data.channel) >= 1) {
                    return this.fireEvent(channels_1.default.client.ipfs.manager, responses_1.ipfsResponse({}, { message: `already listening on ${data.channel}` }), event);
                }
                this.listenEvents(data.channel);
                return this.fireEvent(channels_1.default.client.ipfs.manager, responses_1.ipfsResponse(data), event);
            }
            return this.purgeListener(data.channel);
        });
        this.listenEvents(channels_1.default.server.ipfs.manager);
        this.DEFAULT_MANAGED.forEach((action) => this.listenEvents(channels_1.default.server.ipfs[action]));
    }
    _status() {
        this.registerListener(channels_1.default.server.ipfs.status, (event) => {
            this.fireEvent(channels_1.default.client.ipfs.status, responses_1.ipfsResponse({}), event);
        });
        return this;
    }
    _resolve() {
        this.registerListener(channels_1.default.server.ipfs.resolve, (event, data) => {
            let response;
            ipfs_connector_1.IpfsConnector.getInstance()
                .api
                .resolve(data.hash)
                .then((source) => {
                response = responses_1.ipfsResponse({ content: source, hash: data.hash });
            })
                .catch((error) => {
                console.log(error);
                response = responses_1.ipfsResponse({ hash: data.hash }, { message: error.message });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client.ipfs.resolve, response, event);
            });
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IpfsIPC;
//# sourceMappingURL=IpfsIPC.js.map