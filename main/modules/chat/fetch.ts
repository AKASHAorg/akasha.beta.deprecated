import * as Promise from 'bluebird';
import settings from './settings';
import { GethConnector } from '@akashaproject/geth-connector';
import contracts from '../../contracts/index';
import { BASE_URL, generalSettings } from '../../config/settings';
import { getShortProfile } from '../profile/ipfs';
import { stripHexPrefix } from 'ethereumjs-util';

let chat;
const transform = Promise.coroutine(function* (data: { payload: string, sent: number, hash: string }) {
    let obj, rootHash, userMedia;
    let response = {
        timeStamp: 0,
        profileAddress: '',
        messageHash: '',
        [BASE_URL]: generalSettings.get(BASE_URL)
    };
    const utf = GethConnector.getInstance().web3.toUtf8(data.payload);
    try {
        obj = JSON.parse(utf);
    } catch (err) {
        obj = { message: '', akashaId: '' };
    }
    if (obj.akashaId) {
        response.profileAddress = yield contracts.instance.registry.addressOf(obj.akashaId);
        response.messageHash = data.hash;
        rootHash = yield contracts.instance.profile.getIpfs(response.profileAddress);
        userMedia = yield getShortProfile(rootHash);
        response.timeStamp = data.sent;
    }
    return Object.assign({}, obj, response, userMedia);
});

const execute = Promise.coroutine(function* (data: { stop?: boolean, channel?: string }, cb: any) {
        if (data.stop) {
            if (chat) {
                chat.stopWatching(() => {
                    chat = null;
                });
            }
            return { watching: false };
        }

        if (data.channel && chat) {
            chat.stopWatching(() => {
                chat = null;
            });
            yield Promise.delay(250);
        }
        let current;
        const collection = [];
        const topic = (data.channel) ?
            GethConnector.getInstance().web3.fromUtf8(data.channel) : settings.getDefaultTopic();
        const channel = (data.channel) ? data.channel : null;
        const prefixedTopic = settings.getChanPrefix() + stripHexPrefix(topic);
        settings.setActive(topic);
        // fetch initial messages
        const initial = yield Promise.fromCallback((cb) => {
            return (GethConnector.getInstance().web3.shh.filter({ topics: [prefixedTopic] })).get(cb);
        });
        for (let i = 0; i < initial.length; i++) {
            if (initial[i].hasOwnProperty('payload')) {
                current = yield transform(initial[i]);
                collection.push(current);
            }
        }
        if (chat) {
            return { collection, channel: channel };
        }

        cb(null, { collection, channel: channel });

        // watch for new messages
        chat = GethConnector.getInstance().web3.shh.filter({ topics: [prefixedTopic] });
        chat.watch(function (err, data) {
            if (err) {
                return cb(err);
            }
            if (data.hasOwnProperty('payload')) {
                transform(data).then((message) => {
                    cb(null, { message: message, channel: channel });
                });
            }
        });

        return { watching: true };
    }
);

export default { execute, name: 'fetch', hasStream: true };
