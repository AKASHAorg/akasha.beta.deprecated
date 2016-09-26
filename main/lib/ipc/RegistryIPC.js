"use strict";
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const ethereumjs_util_1 = require('ethereumjs-util');
const channels_1 = require('../channels');
const responses_1 = require('./event/responses');
const index_1 = require('./contracts/index');
const index_2 = require('./modules/auth/index');
const index_3 = require('./modules/profile/index');
class RegistryIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'registry';
        this.DEFAULT_MANAGED = ['getCurrentProfile', 'getByAddress'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._profileExists()
            ._getCurrentProfile()
            ._getByAddress()
            ._registerProfile()
            ._manager();
    }
    _profileExists() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].profileExists, (event, data) => {
            index_1.constructed.instance
                .registry
                .profileExists(data.username)
                .then((exists) => {
                const response = responses_1.mainResponse({
                    exists,
                    username: data.username
                });
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].profileExists, response, event);
            })
                .catch((error) => {
                const response = responses_1.mainResponse({ error: { message: error.message } });
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].profileExists, response, event);
            });
        });
        return this;
    }
    _getCurrentProfile() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getCurrentProfile, (event) => {
            let response;
            index_1.constructed.instance
                .registry
                .getMyProfile()
                .then((address) => {
                const addr = ethereumjs_util_1.unpad(address);
                response = (addr) ? responses_1.mainResponse({ address }) : responses_1.mainResponse({ address: addr });
            })
                .catch((error) => {
                response = responses_1.mainResponse({ error: { message: error.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getCurrentProfile, response, event);
            });
        });
        return this;
    }
    _getByAddress() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getByAddress, (event, data) => {
            let response;
            index_1.constructed.instance
                .registry
                .getByAddress(data.ethAddress)
                .then((address) => {
                const addr = ethereumjs_util_1.unpad(address);
                response = responses_1.mainResponse({ profileAddress: addr });
            })
                .catch((error) => {
                response = responses_1.mainResponse({ error: { message: error.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getByAddress, response, event);
            });
        });
        return this;
    }
    _registerProfile() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].registerProfile, (event, data) => {
            let response;
            index_3.module
                .helpers
                .create(data.ipfs)
                .then((ipfsHash) => {
                return index_1.constructed.instance
                    .registry
                    .register(data.username, ipfsHash, data.gas);
            })
                .then((txData) => {
                return index_2.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx });
            })
                .catch((error) => {
                response = responses_1.mainResponse({ error: { message: error.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].registerProfile, response, event);
            });
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegistryIPC;
//# sourceMappingURL=RegistryIPC.js.map