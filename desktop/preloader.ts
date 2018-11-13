import { CORE_MODULE } from '@akashaproject/common/constants';
import IpcChannelRenderer from './ipc-channel-renderer';
const dataStream = new IpcChannelRenderer(CORE_MODULE.DATA);

Object.defineProperty(window, CORE_MODULE.IPC, {
  value: dataStream ,
});
