import * as Promise from 'bluebird';
import { roomFactory } from './join';
const execute = Promise.coroutine(function* () {
    const rooms = roomFactory.rooms.map((room) => {
        return room.roomName;
    });
    return Promise.resolve({ rooms });
});
export default { execute, name: 'getRooms' };
//# sourceMappingURL=current-rooms.js.map