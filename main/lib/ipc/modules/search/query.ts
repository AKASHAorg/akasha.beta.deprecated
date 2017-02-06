import * as Promise from 'bluebird';
import { GethConnector } from '@akashaproject/geth-connector';
import { whisperIdentity } from '../chat/post';
import { SEARCH_REQUEST, SEARCH_PROVIDER, generalSettings } from '../../config/settings';
import getEntry from '../entry/get-entry';
const execute = Promise.coroutine(function*(data: { text: string, pageSize?: number, offset?: number }) {
    const requestPayLoad = GethConnector.getInstance().web3.fromUtf8(JSON.stringify(data));
    if (!whisperIdentity.from) {
        whisperIdentity.from = yield GethConnector.getInstance().web3.shh.newIdentityAsync();
    }
    const ttl = "0x5";
    const to = generalSettings.get(SEARCH_PROVIDER);

    if(!to) {
        throw new Error("Must run handshake first.");
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

    if(!request){
        throw new Error("Could not send search request.");
    }
    const response = yield Promise.delay(5000).then(() => {
        return Promise.fromCallback(
            (cb) => {
                GethConnector.getInstance()
                    .web3
                    .shh
                    .filter({ topics: [requestPayLoad], to: whisperIdentity.from })
                    .get(cb)
            })
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

    if(!jsonResponse || !jsonResponse.entries) {
        throw new Error('Invalid response from search service.')
    }
    const results = jsonResponse.entries.map((entryId) => {
       return getEntry.execute({entryId});
    });
    const collection = yield Promise.all(results);
    return {collection, total: jsonResponse.count, from: data};
});

export default { execute, name: 'query' };
