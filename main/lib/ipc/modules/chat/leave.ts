import settings from './settings';
import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function*(data: { channels: string[] }) {
    if (!data.channels || !data.channels.length) {
        throw new Error('Must provide at least a channel');
    }

    data.channels.forEach((chan) => {
        settings.TOPICS.delete(GethConnector.getInstance().web3.fromUtf8(chan));
    });

    return { channels: data.channels, numChannels: settings.TOPICS.size };
});

export default { execute, name: 'leave' };
