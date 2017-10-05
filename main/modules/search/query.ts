import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import { whisperIdentity } from '../chat/post';
import { generalSettings, SEARCH_PROVIDER, SEARCH_REQUEST } from '../../config/settings';
import getEntry from '../entry/get-entry';
import { slice } from 'ramda';
import { mixed } from '../models/records';

const execute = Promise.coroutine(function* (data: { text: string, pageSize: number, offset: number }) {
    let cached: {
        text: string,
        total: number,
        results: any[]
    };

    if (mixed.hasShort(data.text)) {
        cached = mixed.getShort(data.text);
    } else {
        const requestPayLoad = GethConnector.getInstance()
            .web3
            .fromUtf8(JSON.stringify({ text: data.text, offset: 0 }));
        if (!whisperIdentity.from) {
            whisperIdentity.from = yield GethConnector.getInstance().web3.shh.newIdentityAsync();
        }
        const ttl = '0x5';
        const to = generalSettings.get(SEARCH_PROVIDER);

        if (!to) {
            throw new Error('Must run handshake first.');
        }

        const request = yield GethConnector.getInstance().web3
            .shh
            .postAsync({
                from: whisperIdentity.from,
                topics: [SEARCH_REQUEST],
                to: to,
                payload: requestPayLoad,
                ttl: ttl
            });

        if (!request) {
            throw new Error('Could not send search request.');
        }
        const response = yield Promise.delay(5000).then(() => {
            return Promise.fromCallback(
                (cb) => {
                    GethConnector.getInstance()
                        .web3
                        .shh
                        .filter({ topics: [requestPayLoad], to: whisperIdentity.from })
                        .get(cb);
                });
        });

        if (!response.length) {
            throw new Error('Search service timed out.');
        }
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(GethConnector.getInstance().web3.toUtf8(response[0].payload));
        } catch (err) {
            jsonResponse = null;
        }

        if (!jsonResponse || !jsonResponse.entries) {
            throw new Error('Invalid response from search service.');
        }

        cached = {
            text: data.text,
            total: jsonResponse.count,
            results: Array.from(jsonResponse.entries)
        };

        mixed.setShort(data.text, cached);
        jsonResponse = null;
    }
    const results = slice(data.offset, data.pageSize + data.offset, cached.results).map((entryId) => {
        return getEntry.execute({ entryId });
    });
    const collection = yield Promise.all(results);
    return { collection, total: cached.total, from: data };
});

export default { execute, name: 'query' };
