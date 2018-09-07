"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@akashaproject/common/constants");
const ipc_channel_main_1 = require("./ipc-channel-main");
function startDataStream(modules, windowId) {
    const ipcChannelMain = new ipc_channel_main_1.default(constants_1.CORE_MODULE.DATA, {
        windowId,
        channelName: 'mainChannel',
    });
    ipcChannelMain.on(function (ev, args) {
        modules[args.module][args.method]
            .execute(args.payload).then(data => ipcChannelMain.send({ data, args }));
    });
    return { ipcChannelMain };
}
exports.default = startDataStream;
//# sourceMappingURL=watcher.js.map