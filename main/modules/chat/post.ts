import * as Promise from 'bluebird';
import settings from './settings';
import { stripHexPrefix } from 'ethereumjs-util';
import { GethConnector } from '@akashaproject/geth-connector';
import currentProfile from '../registry/current-profile';

export const whisperIdentity = {
    from: ''
};
const execute = Promise.coroutine(function* (data: { message: string }) {
    if (data.message.length > 128) {
        throw new Error('Max message length allowed is 128');
    }

    if (!whisperIdentity.from) {
        whisperIdentity.from = yield GethConnector.getInstance().web3.shh.newIdentityAsync();
    }
    const topic = settings.getActive();
    const prefixedTopic = settings.getChanPrefix() + stripHexPrefix(topic);
    const ttl = (settings.isDefaultActive()) ? '0x7080' : '0x15180';
    const from = yield currentProfile.execute();
    const payload = GethConnector.getInstance().web3
        .fromUtf8(
            JSON.stringify({
                message: data.message,
                akashaId: from.akashaId
            }));
    const post = yield GethConnector.getInstance().web3
        .shh
        .postAsync({
            from: whisperIdentity.from,
            topics: [prefixedTopic],
            payload: payload,
            ttl: ttl
        });
    return { post, topic: GethConnector.getInstance().web3.toUtf8(topic) };
});

export default { execute, name: 'post' };
