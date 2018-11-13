import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { GethConnector } from '@akashaproject/geth-connector';
import auth from '../auth/Auth';
import { roomFactory } from './join';

const execute = Promise.coroutine(function* (data: { roomName: string, message: string, token: string }, cb) {
    if (!roomFactory.getRoom(data.roomName)) {
        throw new Error('Join room first before posting');
    }

    const room = roomFactory.getChanPrefix() + data.roomName;
    const stamp = Date.now();
    const message = GethConnector.getInstance().web3.fromAscii(JSON.stringify({ message: data.message, date: stamp }));
    const sig = yield auth.signMessage(message, data.token);
    const signedMessage = JSON.stringify({ content: message, sig });

    const encodedMessage = Buffer.from(signedMessage);
    IpfsConnector.getInstance().api.apiClient.pubsub.publish(room, encodedMessage, () => {
        cb('', { done: true });
    });
    delete data.message;
    return Promise.resolve({ done: false });
});

export default { execute, name: 'post', hasStream: true };
