import * as Promise from 'bluebird';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { roomFactory } from './join';

const execute = Promise.coroutine(function* (data: { roomName: string, message: string }, cb) {
    if (!roomFactory.getRoom(data.roomName)) {
        throw new Error('Join room first before posting');
    }

    const room = roomFactory.getChanPrefix() + data.roomName;
    // @Todo: add signature && aes encryption
    const encodedMessage = Buffer.from(data.message);
    IpfsConnector.getInstance().api.apiClient.pubsub.publish(room, encodedMessage, () => {
        cb('', { done: true });
    });
    delete data.message;
    return Promise.resolve({ done: false });
});

export default { execute, name: 'post', hasStream: true };
