import { CORE_MODULE } from '@akashaproject/common/constants';
import IpcChannelMain from './ipc-channel-main';

export default function startDataStream(modules, windowId) {
  // create listener on main Channel
  const ipcChannelMain = new IpcChannelMain(
    CORE_MODULE.DATA,
    {
      windowId,
      channelName: 'mainChannel',
    });

  ipcChannelMain.on(function (ev, args) {
    // @TODO: add schema validation
    modules
      [args.module][args.method]
      .execute(args.payload).then(data => ipcChannelMain.send({ data, args }));
  });

  return {  ipcChannelMain };
}
