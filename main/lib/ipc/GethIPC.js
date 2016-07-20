"use strict";
const geth_connector_1 = require('@akashaproject/geth-connector');
const AbstractEmitter_1 = require('./event/AbstractEmitter');
const channels_1 = require('../channels');
class GethIPC extends AbstractEmitter_1.AbstractEmitter {
    initListeners() {
        this._start()
            ._restart()
            ._stop();
    }
    attachEmitters() {
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