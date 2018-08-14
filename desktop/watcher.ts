import { CORE_MODULE } from '@akashaproject/common/constants';
import IpcChannelMain from './ipc-channel-main';

export default function startDataStream(modules, windowId) {
  const ipcChannelMainNotify = startChannelNotify(windowId);
  // create listener on main Channel
  const ipcChannelMain = new IpcChannelMain(
    CORE_MODULE.DATA,
    {
      windowId,
      channelName: 'mainChannel',
    });

  ipcChannelMain.on(function (ev, args) {
    ipcChannelMain.send({ main: args });
  });

  return { ipcChannelMainNotify, ipcChannelMain };
}

function startChannelNotify(windowId) {
  const ipcChannelMainNotify = new IpcChannelMain(
    CORE_MODULE.CHANNELS,
    {
      windowId,
      channelName: 'channels',
    });
  ipcChannelMainNotify.on(function (ev, args) {
    // must find a way to serialize channels
    ipcChannelMainNotify.send({ main: args });
  });
  return ipcChannelMainNotify;
}
