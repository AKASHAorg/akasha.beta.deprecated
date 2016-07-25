"use strict";
const geth_connector_1 = require('@akashaproject/geth-connector');
const GethEmitter_1 = require('./event/GethEmitter');
const channels_1 = require('../channels');
const Logger_1 = require('./Logger');
const responses_1 = require('./event/responses');
class GethIPC extends GethEmitter_1.default {
    constructor() {
        super();
        this.logger = 'geth';
        this.DEFAULT_MANAGED = ['startService', 'stopService'];
        this.attachEmitters();
    }
    initListeners(webContents) {
        geth_connector_1.GethConnector.getInstance().setLogger(Logger_1.default.getInstance().registerLogger(this.logger));
        this.webContents = webContents;
        this._start()
            ._restart()
            ._stop()
            ._syncStatus()
            ._logs()
            ._manager();
    }
    _manager() {
        this.registerListener(channels_1.default.server.geth.manager, (event, data) => {
            if (data.listen) {
                if (this.getListenersCount(data.channel) > 1) {
                    return this.fireEvent(channels_1.default.client.geth.manager, responses_1.gethResponse({}, { message: `already listening on ${data.channel}` }), event);
                }
                this.listenEvents(data.channel);
                return this.fireEvent(channels_1.default.client.geth.manager, responses_1.gethResponse(data), event);
            }
            return this.purgeListener(data.channel);
        });
        this.listenEvents(channels_1.default.server.geth.manager);
        this.DEFAULT_MANAGED.forEach((action) => this.listenEvents(channels_1.default.server.geth[action]));
    }
    _start() {
        this.registerListener(channels_1.default.server.geth.startService, (event, data) => {
            geth_connector_1.GethConnector.getInstance().start(data);
        });
        return this;
    }
    _restart() {
        this.registerListener(channels_1.default.server.geth.restartService, (event, data) => {
            geth_connector_1.GethConnector.getInstance().restart(data.timer);
        });
        return this;
    }
    _stop() {
        this.registerListener(channels_1.default.server.geth.stopService, (event, data) => {
            geth_connector_1.GethConnector.getInstance().stop(data.signal);
        });
        return this;
    }
    _syncStatus() {
        this.registerListener(channels_1.default.server.geth.syncStatus, (event) => {
            return geth_connector_1.gethHelper
                .inSync()
                .then((state) => {
                let response;
                if (!state.length) {
                    response = { synced: true };
                }
                else {
                    response = { synced: false, peerCount: state[0] };
                    if (state.length === 2) {
                        Object.assign(response, state[1]);
                    }
                }
                this.fireEvent(channels_1.default.client.geth.syncStatus, responses_1.gethResponse(response), event);
            })
                .catch(err => {
                this.fireEvent(channels_1.default.client.geth.syncStatus, responses_1.gethResponse({}, { message: err.message }), event);
            });
        });
        return this;
    }
    _logs() {
        this.registerListener(channels_1.default.server.geth.logs, (event) => {
            geth_connector_1.GethConnector.getInstance().logger.query({ start: -20, limit: 20 }, (err, info) => {
                let response;
                if (err) {
                    response = responses_1.gethResponse({}, { message: err.message });
                }
                else {
                    response = responses_1.gethResponse(info);
                }
                this.fireEvent(channels_1.default.client.geth.logs, response, event);
            });
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GethIPC;
//# sourceMappingURL=GethIPC.js.map