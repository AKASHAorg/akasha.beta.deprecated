export const generalSettings = new Map();
export const BASE_URL = 'baseUrl';

export const SHORT_WAIT_TIME = 10000;
export const FULL_WAIT_TIME = 15000;

export const FOLLOWING_LIST = 'followingList';
export const BLOCK_INTERVAL = 5300;
export const F_STREAM_I = 'followingStreamIterator';
export const A_STREAM_I = 'allStreamIterator';

export const MENTION_CHANNEL = '0x6d656e74696f6e4368616e6e656c';
export const MENTION_TTL = '0x7080'; // 8h
export const MENTION_TYPE = {
    COMMENT: 'commentMention',
    ENTRY: 'entryMention'
};
// default settings
generalSettings.set(BASE_URL, 'http://127.0.0.1:8080/ipfs');
