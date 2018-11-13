class GenericApi {
    constructor(channel, channelName) {
        this.channel = channel;
        this.channelName = channelName;
    }
}
export class ApiListener extends GenericApi {
    constructor(channel, channelName) {
        super(channel, channelName);
    }
}
//# sourceMappingURL=ipcPreloader.js.map