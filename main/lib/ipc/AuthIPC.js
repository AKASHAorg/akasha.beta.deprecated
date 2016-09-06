"use strict";
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const channels_1 = require('../channels');
const responses_1 = require('./event/responses');
const index_1 = require('./modules/user/index');
const index_2 = require('./contracts/index');
const request_1 = require('request');
const faucetToken = '8336abae5a97f017d2d0ef952a6a566d4bbed5cd22c7b524ae749673d5562b567af10937181b7bdea73edd25512fdb948b3b016034bb01c0d95f8f9beb68c914';
class AuthIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'auth';
        this.DEFAULT_MANAGED = ['login', 'logout', 'requestEther'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._login()
            ._logout()
            ._generateEthKey()
            ._getLocalIdentities()
            ._requestEther()
            ._manager();
    }
    _login() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].login, (event, data) => {
            index_1.module
                .auth
                .login(data.account, data.password, data.rememberTime)
                .then((response) => {
                const response1 = responses_1.mainResponse(response);
                return this.fireEvent(channels_1.default.client[this.MODULE_NAME].login, response1, event);
            });
        });
        return this;
    }
    _logout() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].logout, (event, data) => {
            index_1.module
                .auth
                .logout();
            const response = responses_1.mainResponse({ done: true });
            return this.fireEvent(channels_1.default.client[this.MODULE_NAME].logout, response, event);
        });
        return this;
    }
    _generateEthKey() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].generateEthKey, (event, data) => {
            index_1.module
                .auth
                .generateKey(data.password)
                .then((address) => {
                const response = responses_1.mainResponse({ address: address });
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].generateEthKey, response);
            })
                .catch((error) => {
                const response = responses_1.mainResponse({ error: error });
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].generateEthKey, response);
            });
        });
        return this;
    }
    _getLocalIdentities() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getLocalIdentities, (event, data) => {
            index_2.constructed
                .instance
                .registry
                .getLocalProfiles()
                .then((list) => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getLocalIdentities, responses_1.mainResponse(list));
            })
                .catch((err) => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getLocalIdentities, responses_1.mainResponse({ error: { message: err.message } }));
            });
        });
        return this;
    }
    _requestEther() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].requestEther, (event, data) => {
            request_1.post({
                url: 'https://138.68.78.152:1337/get/faucet',
                json: { address: data.address, token: faucetToken },
                agentOptions: { rejectUnauthorized: false }
            }, (error, response, body) => {
                const data = (error) ? { error: error } : body;
                const response1 = responses_1.mainResponse(data);
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].requestEther, response1);
            });
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthIPC;
//# sourceMappingURL=AuthIPC.js.map