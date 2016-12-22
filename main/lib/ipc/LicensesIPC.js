"use strict";
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const channels_1 = require('../channels');
const responses_1 = require('./event/responses');
const Licenses_1 = require('./modules/models/Licenses');
class LicensesIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'licenses';
        this.DEFAULT_MANAGED = ['getLicenceById'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this
            ._getLicenses()
            ._getLicenceById()
            ._manager();
    }
    _getLicenses() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getLicenses, (event) => {
            const response = responses_1.mainResponse({ licenses: Licenses_1.LicencesList });
            this.fireEvent(channels_1.default.client[this.MODULE_NAME].getLicenses, response, event);
        });
        return this;
    }
    _getLicenceById() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getLicenceById, (event, data) => {
            const response = responses_1.mainResponse({ license: Licenses_1.getLicence(data.id) });
            this.fireEvent(channels_1.default.client[this.MODULE_NAME].getLicenceById, response, event);
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LicensesIPC;
//# sourceMappingURL=LicensesIPC.js.map