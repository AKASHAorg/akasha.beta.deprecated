"use strict";
exports.generalSettings = new Map();
exports.BASE_URL = 'baseUrl';
exports.SHORT_WAIT_TIME = 10000;
exports.FULL_WAIT_TIME = 15000;
exports.FOLLOWING_LIST = 'followingList';
exports.BLOCK_INTERVAL = 5300;
exports.F_STREAM_I = 'followingStreamIterator';
exports.A_STREAM_I = 'allStreamIterator';
exports.MENTION_CHANNEL = '0x6d656e74696f6e4368616e6e656c';
exports.MENTION_TTL = '0x7080';
exports.MENTION_TYPE = {
    COMMENT: 'commentMention',
    ENTRY: 'entryMention'
};
exports.SEARCH_PROVIDER = 'search-provider';
exports.handshakeTimeout = 10;
exports.HANDSHAKE_REQUEST = '0x68616e647368616b6552657175657374';
exports.HANDSHAKE_RESPONSE = '0x68616e647368616b65526573706f6e7365';
exports.HANDSHAKE_DONE = 'handshakeDone';
exports.SEARCH_REQUEST = '0x5345415243485f52455155455354';
exports.generalSettings.set(exports.BASE_URL, 'http://127.0.0.1:8080/ipfs');
exports.generalSettings.set(exports.HANDSHAKE_DONE, false);
//# sourceMappingURL=settings.js.map