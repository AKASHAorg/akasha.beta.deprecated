// import * as Promise from 'bluebird';
// import IpfsConnector from '@akashaproject/ipfs-js-connector';
//
// class RoomFactory {
//     public rooms: any[] = [];
//     private chanPrefix = '0x4ka2hA-*-';
//     private activeChannel: string;
//
//     public join(roomName: string, cb) {
//         if (this.getRoom(roomName)) {
//             throw new Error(`Already subscribed to ${roomName}`);
//         }
//         const handler = (message) => {
//             cb('', {
//                 roomName: roomName, message: {
//                     data: message.data.toString(),
//                     from: message.from
//                 }
//             });
//         };
//         IpfsConnector.getInstance().api.apiClient.pubsub.subscribe(this.chanPrefix + roomName, {
//             discover: true
//         }, handler);
//
//         this.rooms.push({ roomName, handler });
//     }
//
//     public getRoom(roomName: string) {
//         return this.rooms.find((obj) => obj.roomName === roomName);
//     }
//
//     public setActive(channel: string) {
//         this.activeChannel = channel;
//     }
//
//     public getActive() {
//         return this.activeChannel;
//     }
//
//     public closeAll() {
//         this.rooms.forEach((data) => {
//                 IpfsConnector.getInstance().api.apiClient.pubsub.unsubscribe(this.chanPrefix + data.roomName, data.handler);
//             }
//         );
//         this.rooms.length = 0;
//     }
//
//     public leave(roomName: string) {
//         const room = this.getRoom(roomName);
//         IpfsConnector.getInstance().api.apiClient.pubsub.unsubscribe(this.chanPrefix + roomName, room.handler);
//         const index = this.rooms.indexOf(room);
//         if (index !== -1) {
//             this.rooms.splice(index, 1);
//         }
//
//     }
//
//     public getChanPrefix() {
//         return this.chanPrefix;
//     }
// }
//
// export const roomFactory = new RoomFactory();
//
// const execute = Promise.coroutine(function* (data: { channels: string[] }, cb) {
//     if (!data.channels || !data.channels.length) {
//         throw new Error('Must provide at least a channel');
//     }
//     data.channels.forEach((chan) => {
//         roomFactory.join(chan, cb);
//     });
//
//     console.log(roomFactory);
//     delete data.channels;
//
//     return Promise.resolve({ numChannels: roomFactory.rooms.length });
// });
//
// export default { execute, name: 'join', hasStream: true };
