import * as Promise from 'bluebird';
import IpfsConnector from '@akashaproject/ipfs-js-connector';
class RoomFactory {
    constructor() {
        this.rooms = [];
        this.chanPrefix = '0x4ka2hA-*-';
    }
    join(roomName, cb) {
        if (this.getRoom(roomName)) {
            throw new Error(`Already subscribed to ${roomName}`);
        }
        const handler = (message) => {
            cb('', {
                roomName: roomName, message: {
                    data: message.data.toString(),
                    from: message.from
                }
            });
        };
        IpfsConnector.getInstance().api.apiClient.pubsub.subscribe(this.chanPrefix + roomName, {
            discover: true
        }, handler);
        this.rooms.push({ roomName, handler });
    }
    getRoom(roomName) {
        return this.rooms.find((obj) => obj.roomName === roomName);
    }
    setActive(channel) {
        this.activeChannel = channel;
    }
    getActive() {
        return this.activeChannel;
    }
    closeAll() {
        this.rooms.forEach((data) => {
            IpfsConnector.getInstance().api.apiClient.pubsub.unsubscribe(this.chanPrefix + data.roomName, data.handler);
        });
        this.rooms.length = 0;
    }
    leave(roomName) {
        const room = this.getRoom(roomName);
        IpfsConnector.getInstance().api.apiClient.pubsub.unsubscribe(this.chanPrefix + roomName, room.handler);
        const index = this.rooms.indexOf(room);
        if (index !== -1) {
            this.rooms.splice(index, 1);
        }
    }
    getChanPrefix() {
        return this.chanPrefix;
    }
}
export const roomFactory = new RoomFactory();
const execute = Promise.coroutine(function* (data, cb) {
    if (!data.channels || !data.channels.length) {
        throw new Error('Must provide at least a channel');
    }
    data.channels.forEach((chan) => {
        roomFactory.join(chan, cb);
    });
    console.log(roomFactory);
    delete data.channels;
    return Promise.resolve({ numChannels: roomFactory.rooms.length });
});
export default { execute, name: 'join', hasStream: true };
//# sourceMappingURL=join.js.map