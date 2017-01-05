import * as Promise from 'bluebird';
import { TOPICS } from './settings';
import { GethConnector } from '@akashaproject/geth-connector';
import currentProfile from '../registry/current-profile';

let whisperIdentity;
const execute = Promise.coroutine(function*(data: { message: string }) {
    if (data.message.length > 128) {
        throw new Error("Max message length allowed is 128");
    }

    if (!whisperIdentity) {
        whisperIdentity = yield GethConnector.getInstance().web3.shh.newIdentityAsync();
    }
    const from = yield currentProfile.execute();
    const payload = JSON.stringify({ message: data.message, from: from.akashaId });
    const post = yield GethConnector.getInstance().web3
        .shh
        .postAsync({
            from: whisperIdentity,
            topics: TOPICS,
            payload: payload,
            priority: 500,
            ttl: 3600
        });
    return { post };
});

export default { execute, name: 'post' };
