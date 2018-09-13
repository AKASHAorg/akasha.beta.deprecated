"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@akashaproject/common/constants");
const ipc_channel_main_1 = require("./ipc-channel-main");
const dataStream = {
    id: '/dataStream',
    type: 'object',
    properties: {
        module: { type: 'string' },
        method: { type: 'string' },
        payload: { type: 'object' },
    },
    required: ['module', 'method', 'payload'],
};
function startDataStream(modules, windowId, getService) {
    const ipcChannelMain = new ipc_channel_main_1.default(constants_1.CORE_MODULE.DATA, {
        windowId,
        channelName: 'mainChannel',
    });
    ipcChannelMain.on(function (ev, args) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        console.log(getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator, v);
        const result = v.validate(args, dataStream);
        if (!result.valid) {
            return ipcChannelMain.send({ args, error: result.errors });
        }
        modules[args.module][args.method]
            .execute(args.payload).then(data => ipcChannelMain.send({ data, args }));
    });
    return { ipcChannelMain };
}
exports.default = startDataStream;
//# sourceMappingURL=watcher.js.map