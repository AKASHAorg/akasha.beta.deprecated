"use strict";
const Promise = require('bluebird');
const geth_connector_1 = require('@akashaproject/geth-connector');
const post_1 = require('../chat/post');
const settings_1 = require('../../config/settings');
const get_entry_1 = require('../entry/get-entry');
const ramda_1 = require('ramda');
const records_1 = require('../models/records');
const execute = Promise.coroutine(function* (data) {
    let results;
    let cached;
    if (records_1.mixed.hasShort(data.text)) {
        cached = records_1.mixed.getShort(data.text);
        results = ramda_1.slice(data.offset, data.pageSize + data.offset, cached.results).map((entryId) => {
            return get_entry_1.default.execute({ entryId });
        });
    }
    else {
        const requestPayLoad = geth_connector_1.GethConnector.getInstance().web3.fromUtf8(JSON.stringify(data));
        if (!post_1.whisperIdentity.from) {
            post_1.whisperIdentity.from = yield geth_connector_1.GethConnector.getInstance().web3.shh.newIdentityAsync();
        }
        const ttl = "0x5";
        const to = settings_1.generalSettings.get(settings_1.SEARCH_PROVIDER);
        if (!to) {
            throw new Error("Must run handshake first.");
        }
        const request = yield geth_connector_1.GethConnector.getInstance().web3
            .shh
            .postAsync({
            from: post_1.whisperIdentity.from,
            topics: [settings_1.SEARCH_REQUEST],
            to: to,
            payload: requestPayLoad,
            ttl: ttl
        });
        if (!request) {
            throw new Error("Could not send search request.");
        }
        const response = yield Promise.delay(5000).then(() => {
            return Promise.fromCallback((cb) => {
                geth_connector_1.GethConnector.getInstance()
                    .web3
                    .shh
                    .filter({ topics: [requestPayLoad], to: post_1.whisperIdentity.from })
                    .get(cb);
            });
        });
        if (!response.length) {
            throw new Error('Search service timed out.');
        }
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(geth_connector_1.GethConnector.getInstance().web3.toUtf8(response[0].payload));
        }
        catch (err) {
            jsonResponse = null;
        }
        if (!jsonResponse || !jsonResponse.entries) {
            throw new Error('Invalid response from search service.');
        }
        console.log(jsonResponse.entries);
        cached = {
            text: data.text,
            total: jsonResponse.count,
            results: Array.from(jsonResponse.entries)
        };
        records_1.mixed.setShort(data.text, cached);
        jsonResponse = null;
        results = ramda_1.slice(0, data.pageSize, cached.results).map((entryId) => {
            return get_entry_1.default.execute({ entryId });
        });
    }
    const collection = yield Promise.all(results);
    return { collection, total: cached.total, from: data };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'query' };
//# sourceMappingURL=query.js.map