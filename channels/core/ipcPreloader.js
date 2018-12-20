"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenericApi {
    constructor(channel, channelName) {
        this.channel = channel;
        this.channelName = channelName;
    }
}
class ApiListener extends GenericApi {
    constructor(channel, channelName) {
        super(channel, channelName);
    }
}
exports.ApiListener = ApiListener;
//# sourceMappingURL=ipcPreloader.js.map