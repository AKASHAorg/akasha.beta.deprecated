import { CORE_MODULE } from '@akashaproject/common/constants';
import IpcChannelRenderer from './ipc-channel-renderer';

const channels = new IpcChannelRenderer(CORE_MODULE.CHANNELS);
const dataStream = new IpcChannelRenderer(CORE_MODULE.DATA);

Object.defineProperty(window, CORE_MODULE.IPC, {
  value: { channels, dataStream },
});
