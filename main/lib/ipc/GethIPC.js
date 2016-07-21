"use strict";
const geth_connector_1 = require('@akashaproject/geth-connector');
const GethEmitter_1 = require('./event/GethEmitter');
const channels_1 = require('../channels');
const Logger_1 = require('./Logger');
class GethIPC extends GethEmitter_1.default {
    constructor() {
        super();
        this.logger = 'gethLog';
        geth_connector_1.GethConnector.getInstance().setLogger(Logger_1.default.getInstance().registerLogger(this.logger));
        this.attachEmitters();
        this.registerListener(channels_1.default.server.geth.manager, (event, data) => {
            if (data.listen) {
                this.listenEvents(data.channel);
                this.fireEvent(channels_1.default.client.geth.manager, { data: data }, event);
            }
            this.purgeListener(data.channel);
        });
        this.listenEvents(channels_1.default.server.geth.manager);
    }
    initListeners() {
        this._start()
            ._restart()
            ._stop();
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
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GethIPC;
//# sourceMappingURL=GethIPC.js.map