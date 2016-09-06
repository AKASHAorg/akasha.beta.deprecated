"use strict";
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const channels_1 = require('../channels');
const responses_1 = require('./event/responses');
const index_1 = require('./contracts/index');
class RegistryIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'registry';
        this.DEFAULT_MANAGED = ['getCurrentProfile', 'getByAddress'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
    }
    _profileExists() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].profileExists, (event, data) => {
            index_1.constructed.instance
                .registry
                .profileExists(data.username)
                .then((exists) => {
                const response = responses_1.mainResponse({ exists: exists, username: data.username });
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].profileExists, response);
            })
                .catch((error) => {
                const response = responses_1.mainResponse({ error: error });
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].profileExists, response);
            });
        });
        return this;
    }
}
//# sourceMappingURL=RegistryIPC.js.map