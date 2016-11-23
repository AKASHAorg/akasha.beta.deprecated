"use strict";
const channels_1 = require('./lib/channels');
const ipcPreloader_1 = require('./ipcPreloader');
function injectApi() {
    const AkashaApi = Object.assign({}, channels_1.default);
    Object.keys(channels_1.default.client).forEach((module) => {
        Object.keys(channels_1.default.client[module]).forEach((method) => {
            AkashaApi.client[module][method] = new ipcPreloader_1.ApiListener(channels_1.default.client[module][method], method);
        });
    });
    Object.keys(channels_1.default.server).forEach((module) => {
        Object.keys(channels_1.default.server[module]).forEach((method) => {
            if (method !== 'manager') {
                AkashaApi.server[module][method] = new ipcPreloader_1.ApiRequest(channels_1.default.server[module][method], channels_1.default.server[module]['manager'], method);
            }
        });
    });
    return AkashaApi;
}
window['Channel'] = injectApi();
//# sourceMappingURL=preloader.js.map