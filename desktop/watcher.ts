import { CORE_MODULE } from '@akashaproject/common/constants';
import IpcChannelMain from './ipc-channel-main';

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

export default function startDataStream(modules, windowId, getService) {
  // create listener on main Channel
  const ipcChannelMain = new IpcChannelMain(
    CORE_MODULE.DATA,
    {
      windowId,
      channelName: 'mainChannel',
    });

  ipcChannelMain.on(function (ev, args) {
    const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
    const result = v.validate(args, dataStream);
    if (!result.valid) {
      return ipcChannelMain.send({ args, error: result.errors });
    }
    modules
      [args.module][args.method]
      .execute(args.payload).then(data => ipcChannelMain.send({ data, args }));
  });

  return {  ipcChannelMain };
}
