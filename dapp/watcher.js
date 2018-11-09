'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const constants_1 = require('@akashaproject/common/constants');
const channel_1 = require('./channel');
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

function startDataStream(modules, windowId, getService, logger) {
  const ipcChannelMain = new channel_1.default(constants_1.CORE_MODULE.DATA, {
    windowId,
    channelName: 'mainChannel',
  });
  const ipcChannelUI = new channel_1.default(constants_1.CORE_MODULE.DATA);
  ipcChannelMain.bind(ipcChannelUI.subject);
  ipcChannelUI.bind(ipcChannelMain.subject);
  const ipcLogger = logger.child({ module: 'IPC' });
  ipcChannelMain.on(function (error, args) {
    if (error) {
      return ipcChannelMain.send({ args, error });
    }
    const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    const result = v.validate(args, dataStream);
    if (!result.valid) {
      ipcLogger.debug({ args, result });
      return ipcChannelMain.send({ args, error: result.errors });
    }
    let call;
    let response;
    const method = modules[args.module][args.method];
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
        ipcLogger.debug({ args, err });
        response = { args, error: err };
      })
      .finally(() => {
        ipcChannelMain.send(response);
        response = null;
      });
  });
  return { ipcChannelMain, ipcChannelUI };
}

exports.default = startDataStream;
//# sourceMappingURL=watcher.js.map