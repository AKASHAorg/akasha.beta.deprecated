import * as Promise from 'bluebird';
import { equals } from 'ramda';
import { GethConnector } from '@akashaproject/geth-connector';
import {
    searchProvider,
    generalSettings,
    SEARCH_PROVIDER,
    HANDSHAKE_REQUEST,
    HANDSHAKE_RESPONSE,
    HANDSHAKE_DONE,
    handshakeTimeout
} from '../../config/settings';
import { randomBytesAsync } from '../auth/Auth';
import { whisperIdentity } from '../chat/post';

const execute = Promise.coroutine(function*(data: { provider?: string, timeout?: number }) {
    const provider = (data.provider) ? data.provider : searchProvider;
    const timeout = (data.timeout) ? data.timeout : handshakeTimeout;
    generalSettings.set(SEARCH_PROVIDER, provider);
    const seed = yield randomBytesAsync(32);

    const message = GethConnector.getInstance()
        .web3
        .sha3(seed.toString('hex'), { encoding: 'hex' });
    const jsonMessage = { message: message, date: (new Date()).toJSON() };

    if (!whisperIdentity.from) {
        whisperIdentity.from = yield GethConnector.getInstance().web3.shh.newIdentityAsync();
    }

    const payload = GethConnector.getInstance().web3
        .fromUtf8(JSON.stringify(jsonMessage));
    const ttl = GethConnector.getInstance().web3
        .fromDecimal(timeout);

    const init = yield GethConnector.getInstance().web3
        .shh
        .postAsync({
            from: whisperIdentity.from,
            topics: [HANDSHAKE_REQUEST],
            to: provider,
            payload: payload,
            ttl: ttl
        });
    if (!init) {
        throw new Error('Could not send handshake request.');
    }
    const response = yield Promise.delay(timeout * 10000).then(() => {
        return Promise.fromCallback(
            (cb) => {
                GethConnector.getInstance()
                    .web3
                    .shh
                    .filter({ topics: [HANDSHAKE_RESPONSE], to: whisperIdentity.from })
                    .get(cb)
            })
    });

    if (!response.length) {
        throw new Error('Search service timed out.');
    }
    let actual;
    for (let i = 0; i < response.length; i++) {
        if (response[i].hasOwnProperty('payload')) {
            actual = GethConnector.getInstance().web3.toUtf8(response[i].payload);
            if (equals(payload, actual)) {
                generalSettings.set(HANDSHAKE_DONE, true);
                break;
            }
        }
    }

    if (!generalSettings.get(HANDSHAKE_DONE)) {
        throw new Error('Could not handshake.');
    }

    return { searchService: init }
});

export default { execute, name: 'handshake' };