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
        const result = v.validate(args, dataStream);
        if (!result.valid) {
            return ipcChannelMain.send({ args, error: result.errors });
        }
        let call;
        let response;
        const method = modules[args.module][args.method];
        console.log(modules[args.module]);
        if (!method) {
            return ipcChannelMain.send({
                args,
                error: { message: `Method ${args.method} not found on ${args.module} module` },
            });
        }
        if (method.hasStream) {
            call = method.execute(args.payload, (err, data) => {
                let resp;
                if (err) {
                    resp = { args, error: err };
                }
                else {
                    resp = { data, args };
                }
                ipcChannelMain.send(resp);
                resp = null;
            });
        }
        else {
            call = method.execute(args.payload);
        }
        call
            .then(data => response = { data, args })
            .catch((err) => {
            console.log(err);
            response = { args, error: err };
        })
            .finally(() => {
            ipcChannelMain.send(response);
            response = null;
        });
    });
    return { ipcChannelMain };
}
exports.default = startDataStream;
//# sourceMappingURL=watcher.js.map