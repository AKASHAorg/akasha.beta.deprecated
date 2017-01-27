"use strict";
const Promise = require('bluebird');
const geth_connector_1 = require('@akashaproject/geth-connector');
const current_profile_1 = require('../registry/current-profile');
const post_1 = require('../chat/post');
const settings_1 = require('../../config/settings');
const ramda_1 = require('ramda');
const execute = Promise.coroutine(function* (data) {
    if (data.mention.length > 10) {
        throw new Error('Can mention max 10 users');
    }
    if (!post_1.whisperIdentity.from) {
        post_1.whisperIdentity.from = yield geth_connector_1.GethConnector.getInstance().web3.shh.newIdentityAsync();
    }
    const mention = ramda_1.uniq(data.mention);
    const mentionType = (data.commentId) ? settings_1.MENTION_TYPE.COMMENT : settings_1.MENTION_TYPE.ENTRY;
    const from = yield current_profile_1.default.execute();
    const payload = geth_connector_1.GethConnector.getInstance().web3
        .fromUtf8(JSON.stringify({
        mention: mention,
        akashaId: from.akashaId,
        mentionType: mentionType,
        entryId: data.entryId,
        commentId: data.commentId
    }));
    const post = yield geth_connector_1.GethConnector.getInstance().web3
        .shh
        .postAsync({
        from: post_1.whisperIdentity.from,
        topics: [settings_1.MENTION_CHANNEL],
        payload: payload,
        ttl: settings_1.MENTION_TTL
    });
    return { post, mention };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'mention' };
//# sourceMappingURL=mention.js.map