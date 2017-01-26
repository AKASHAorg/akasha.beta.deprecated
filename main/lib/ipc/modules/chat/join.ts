import settings from './settings';
import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';

const execute = Promise.coroutine(function*(data: { channels: string[] }) {
    if (!data.channels || !data.channels.length) {
        throw new Error('Must provide at least a channel');
    }
    //const maxChannels = 10;
    data.channels.forEach((chan) => {
        /**if (settings.TOPICS.size === maxChannels) {
            throw new Error(`Max ${maxChannels} channels reached`);
        }**/
        settings.TOPICS.add(GethConnector.getInstance().web3.fromUtf8(chan));
    });

    return { channels: data.channels, numChannels: settings.TOPICS.size };
});

export default { execute, name: 'join' };
