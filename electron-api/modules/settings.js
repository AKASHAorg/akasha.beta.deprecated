export const STATICS = {
    "GETH_SETPROVIDER_TIMEOUT": 4000
};

export const EVENTS = {
    "server": {
        "geth": {
            "startService": "server:geth:startService"
        },
        "ipfs": {
            "startService": "server:ipfs:startService"
        },
        "logger": {
            "gethInfo" : "server:logger:gethInfo",
            "stopGethInfo" : "server:logger:stopGethInfo"
        }
    },
    "client": {
        "geth": {
            "startService": "client:geth:startService",
            "startSyncing": "client:geth:startSyncing",
            "syncUpdate": "client:geth:syncUpdate"
        },
        "ipfs": {
            "startService": "client:ipfs:startService"
        },
        "logger": {
            "gethInfo" : "client:logger:gethInfo",
            "stopGethInfo" : "client:logger:stopGethInfo"
        }
    }
};
