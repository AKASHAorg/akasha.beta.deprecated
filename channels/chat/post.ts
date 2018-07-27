// import * as Promise from 'bluebird';
// import IpfsConnector from '@akashaproject/ipfs-js-connector';
// import { web3Api } from '../../services';
// import auth from '../auth-web3/Auth';
// import { roomFactory } from './join';
// const Buffer = require('safe-buffer').Buffer;
//
// const execute = Promise.coroutine(function* (data: { roomName: string, message: string, token: string }, cb) {
//     if (!roomFactory.getRoom(data.roomName)) {
//         throw new Error('Join room first before posting');
//     }
//
//     const room = roomFactory.getChanPrefix() + data.roomName;
//     const stamp = Date.now();
//     const message = web3Api.instance.fromAscii(JSON.stringify({ message: data.message, date: stamp }));
//     const sig = yield auth.signMessage(message, data.token);
//     const signedMessage = JSON.stringify({ content: message, sig });
//
//     const encodedMessage = Buffer.from(signedMessage);
//     IpfsConnector.getInstance().api.apiClient.pubsub.publish(room, encodedMessage, () => {
//         cb('', { done: true });
//     });
//     delete data.message;
//     return Promise.resolve({ done: false });
// });
//
// export default { execute, name: 'post', hasStream: true };
