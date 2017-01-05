import * as Promise from 'bluebird';
import { TOPICS } from './settings';
import { GethConnector } from '@akashaproject/geth-connector';

let chat;
const execute = Promise.coroutine(function*(data: { stop?: boolean }, cb: any) {
    if (data.stop && chat) {
        chat.stopWatching(() => {
        });
        return { post: null };
    }

    chat = GethConnector.getInstance().web3.shh.filter({ topics: TOPICS });
    chat.watch(function(err, data){
        cb(err, JSON.parse(data));
    });
    return { post: true };
});

export default { execute, name: 'fetch' };
