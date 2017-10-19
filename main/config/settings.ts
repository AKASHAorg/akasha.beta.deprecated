export const generalSettings = new Map();
export const BASE_URL = 'baseUrl';

export const INSTANT_WAIT_TIME = 300;
export const SHORT_WAIT_TIME = 9000;
export const MEDIUM_WAIT_TIME = 15000;
export const FULL_WAIT_TIME = 36000;

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
export const SEARCH_PROVIDER = 'search-provider';
export const handshakeTimeout = 10; // nr of seconds
export const HANDSHAKE_REQUEST = '0x68616e647368616b6552657175657374';
export const HANDSHAKE_RESPONSE = '0x68616e647368616b65526573706f6e7365';
export const HANDSHAKE_DONE = 'handshakeDone';

export const SEARCH_REQUEST = '0x5345415243485f52455155455354';

export const BACKUP_KEYS_NAME = 'akasha_keystore.zip';

export const FAUCET_TOKEN = '8336abae5a97f017d2d0ef952a6a566d4bbed5cd22c7b524ae749673d5562b567af109371' +
    '81b7bdea73edd25512fdb948b3b016034bb01c0d95f8f9beb68c914';

export const FAUCET_URL = 'https://138.68.78.152:1337/get/faucet';

export const BOOTNODE = 'enode://7f809ac6c56bf8a387ad3c759ece63bc4cde466c5f06b2d68e0f21928470dd35949e978091537e1fb633a' +
    '1a7eaf06630234d22d1b0c1d98b4643be5f28e5fe79@138.68.78.152:30301';
export const GETH_LOGGER = 'geth';
export const IPFS_LOGGER = 'ipfs';

export const IPFS_PEER_ID = [
    '/ip4/46.101.103.114/tcp/4001/ipfs/QmYfXRuVWMWFRJxUSFPHtScTNR9CU2samRsTK15VFJPpvh',
    '/ip4/46.101.222.96/tcp/4001/ipfs/QmWfVX1MTacGQ1to1u17MtHPpgANR1UJk9h6JqtbYaRKre'
];

export const IPFS_CIRCUIT_RELAYS = [
    '/p2p-circuit/ipfs/QmWfVX1MTacGQ1to1u17MtHPpgANR1UJk9h6JqtbYaRKre'
];
// default settings
generalSettings.set(BASE_URL, 'http://127.0.0.1:8080/ipfs');
generalSettings.set(HANDSHAKE_DONE, false);
