export const STATICS = {
    "GETH_SETPROVIDER_TIMEOUT": 4000
};

export const EVENTS = {
    "server": {
        "geth": {
            "startService": "server:geth:startService"
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
        "logger": {
            "gethInfo" : "client:logger:gethInfo",
            "stopGethInfo" : "client:logger:stopGethInfo"
        }
    }
};
