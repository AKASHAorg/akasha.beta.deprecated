"use strict";
const geth_connector_1 = require("@akashaproject/geth-connector");
const GethEmitter_1 = require("./event/GethEmitter");
const channels_1 = require("../channels");
const Logger_1 = require("./Logger");
const responses_1 = require("./event/responses");
const path_1 = require("path");
const electron_1 = require("electron");
const genesis_1 = require("./config/genesis");
class GethIPC extends GethEmitter_1.default {
    constructor() {
        super();
        this.logger = 'geth';
        this.BOOTNODE = 'enode://7f809ac6c56bf8a387ad3c759ece63bc4cde466c5f06b2d68e0f21928470dd35949e978091537e1fb633a' +
            '1a7eaf06630234d22d1b0c1d98b4643be5f28e5fe79@138.68.78.152:30301';
        this.DEFAULT_MANAGED = ['startService', 'stopService', 'status'];
        this.attachEmitters();
    }
    initListeners(webContents) {
        geth_connector_1.GethConnector.getInstance().setLogger(Logger_1.default.getInstance().registerLogger(this.logger));
        geth_connector_1.GethConnector.getInstance().setBinPath(electron_1.app.getPath('userData'));
        this.webContents = webContents;
        const datadir = geth_connector_1.GethConnector.getDefaultDatadir();
        geth_connector_1.GethConnector.getInstance().setOptions({
            bootnodes: this.BOOTNODE,
            datadir: path_1.join(datadir, 'akasha-alpha'),
            ipcpath: path_1.join(datadir, 'akasha-alpha', 'geth.ipc'),
            networkid: 511337,
            shh: ''
        });
        this._start()
            ._restart()
            ._stop()
            ._syncStatus()
            ._logs()
            ._status()
            ._options()
            ._manager();
    }
    _manager() {
        this.registerListener(channels_1.default.server.geth.manager, (event, data) => {
            if (data.listen) {
                if (this.getListenersCount(data.channel) >= 1) {
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
            geth_connector_1.GethConnector.getInstance().writeGenesis(genesis_1.getGenesisPath(), (err, stdout) => {
                if (err) {
                    (Logger_1.default.getInstance().getLogger(this.logger)).error(err);
                }
                (Logger_1.default.getInstance().getLogger(this.logger)).info(stdout);
                geth_connector_1.GethConnector.getInstance().start(data);
            });
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
            geth_connector_1.GethConnector.getInstance().stop();
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
            geth_connector_1.GethConnector.getInstance().logger.query({ start: 0, limit: 20, order: 'desc' }, (err, info) => {
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
    _status() {
        this.registerListener(channels_1.default.server.geth.status, (event) => {
            if (!geth_connector_1.GethConnector.getInstance().serviceStatus.api) {
                this.fireEvent(channels_1.default.client.geth.status, responses_1.gethResponse({}), event);
                return null;
            }
            let response;
            geth_connector_1.GethConnector.getInstance()
                .web3
                .eth
                .getBlockNumberAsync()
                .then((blockNr) => {
                response = responses_1.gethResponse({ blockNr });
            })
                .catch((err) => {
                response = responses_1.gethResponse({}, { message: err.message });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client.geth.status, response, event);
            });
        });
        return this;
    }
    _options() {
        this.registerListener(channels_1.default.server.geth.options, (event, data) => {
            const options = geth_connector_1.GethConnector.getInstance().setOptions(data);
            let mapObj = Object.create(null);
            for (let [k, v] of options) {
                mapObj[k] = v;
            }
            this.fireEvent(channels_1.default.client.geth.options, responses_1.gethResponse(mapObj), event);
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GethIPC;
//# sourceMappingURL=GethIPC.js.map