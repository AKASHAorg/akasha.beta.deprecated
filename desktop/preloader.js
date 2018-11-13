"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@akashaproject/common/constants");
const ipc_channel_renderer_1 = require("./ipc-channel-renderer");
const dataStream = new ipc_channel_renderer_1.default(constants_1.CORE_MODULE.DATA);
Object.defineProperty(window, constants_1.CORE_MODULE.IPC, {
    value: dataStream,
});
//# sourceMappingURL=preloader.js.map