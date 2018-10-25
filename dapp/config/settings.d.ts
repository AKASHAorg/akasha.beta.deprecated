export declare const generalSettings: Map<any, any>;
export declare const BASE_URL = "baseUrl";
export declare const OP_WAIT_TIME = 15000;
export declare const SHORT_WAIT_TIME = 48000;
export declare const MEDIUM_WAIT_TIME = 15000;
export declare const FULL_WAIT_TIME = 96000;
export declare const FOLLOWING_LIST = "followingList";
export declare const BLOCK_INTERVAL = 5300;
export declare const F_STREAM_I = "followingStreamIterator";
export declare const A_STREAM_I = "allStreamIterator";
export declare const BACKUP_KEYS_NAME = "akasha_keystore.zip";
export declare const FAUCET_TOKEN = "0x7016aec60a8cb208833d8cd9a05f5705a3600b2c2796180503373f56b3e0d959";
export declare const FAUCET_URL = "https://akasha.fun/get/faucet";
export declare const GETH_LOGGER = "geth";
export declare const IPFS_LOGGER = "ipfs";
export declare const defaultPath = "ipfs#akasha-beta";
export declare const DEFAULT_CIRCUIT_RELAYS: string[];
export declare const IPFS_CIRCUIT_RELAYS: string[];
export declare const AKASHA_BOOTSTRAP_PEERS: string[];
export declare const IPFS_BOOTSTRAP_PEERS: string[];
export declare const DEFAULT_IPFS_CONFIG: {
    Addresses: {
        Swarm: string[];
        API: string;
        Gateway: string;
    };
    Bootstrap: string[];
    Discovery: {
        MDNS: {
            Enabled: boolean;
            Interval: number;
        };
        webRTCStar: {
            Enabled: boolean;
        };
    };
    EXPERIMENTAL: {
        pubsub: boolean;
    };
    relay: {
        enabled: boolean;
        hop: {
            enabled: boolean;
        };
    };
};
