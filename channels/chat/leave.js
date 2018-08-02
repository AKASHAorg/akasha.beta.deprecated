import * as Promise from 'bluebird';
import { roomFactory } from './join';
const execute = Promise.coroutine(function* (data) {
    roomFactory.leave(data.roomName);
    return Promise.resolve({ done: true });
});
export default { execute, name: 'leave' };
//# sourceMappingURL=leave.js.map