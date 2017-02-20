"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const following_list_1 = require("../profile/following-list");
const current_profile_1 = require("../registry/current-profile");
const records_1 = require("../models/records");
const settings_1 = require("../../config/settings");
const geth_connector_1 = require("@akashaproject/geth-connector");
const get_entry_1 = require("./get-entry");
const fetch = Promise.coroutine(function* (entries, following, toBlock, limit) {
    const fromBlock = toBlock - settings_1.BLOCK_INTERVAL;
    const filter = { fromBlock: (fromBlock > 0) ? fromBlock : 0, toBlock: toBlock };
    let rounds = limit;
    let events, lastBlock;
    while (rounds--) {
        events = yield index_1.constructed.instance.entries.getPublished(filter);
        yield Promise.delay(5);
    }
    events.sort((a, b) => {
        return b.blockNumber - a.blockNumber;
    });
    for (let i = 0; i < events.length; i++) {
        if (following.indexOf(events[i].args.author) !== -1) {
            entries.add(events[i].args.entryId.toString());
            if (entries.size === limit) {
                lastBlock = events[i].blockNumber;
                break;
            }
        }
    }
    return lastBlock;
});
const execute = Promise.coroutine(function* (data) {
    if (data.purgeCache) {
        records_1.mixed.removeFull(settings_1.FOLLOWING_LIST);
    }
    if (!records_1.mixed.hasFull(settings_1.FOLLOWING_LIST)) {
        const myProfile = yield current_profile_1.default.execute();
        const following = yield following_list_1.default.execute({ akashaId: myProfile.akashaId });
        records_1.mixed.setFull(settings_1.FOLLOWING_LIST, following.collection);
    }
    let toBlock = (data.toBlock) ? data.toBlock :
        yield geth_connector_1.GethConnector.getInstance()
            .web3
            .eth
            .getBlockNumberAsync();
    const indexBlock = toBlock;
    const following = records_1.mixed.getFull(settings_1.FOLLOWING_LIST);
    const limit = (data.limit) ? data.limit : 5;
    let lastBlock, entries, cache;
    if (records_1.mixed.hasFull(`${settings_1.F_STREAM_I}${data.toBlock}`)) {
        cache = records_1.mixed.getFull(`${settings_1.F_STREAM_I}${data.toBlock}`);
        entries = cache.entries;
        lastBlock = cache.lastBlock;
    }
    else {
        entries = new Set();
        while (entries.size < limit && toBlock > 0) {
            lastBlock = yield fetch(entries, following, toBlock, limit);
            toBlock -= settings_1.BLOCK_INTERVAL;
        }
        records_1.mixed.setFull(`${settings_1.F_STREAM_I}${indexBlock}`, { entries, lastBlock });
    }
    const collection = yield Promise.all(Array.from(entries).map((entryId) => get_entry_1.default.execute({ entryId })));
    return { collection, toBlock: data.toBlock, lastBlock: lastBlock };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'followingStreamIterator' };
//# sourceMappingURL=following-stream-iterator.js.map