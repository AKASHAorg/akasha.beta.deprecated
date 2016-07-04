export const STATICS = {
    GETH_SETPROVIDER_TIMEOUT: 4000
};

export const EVENTS = {
    server: {
        geth: {
            startService: 'server:geth:startService',
            stopService: 'server:geth:stopService',
            contract: 'server:geth.contract'
        },
        ipfs: {
            startService: 'server:ipfs:startService',
            stopService: 'server:ipfs:stopService'
        },
        logger: {
            gethInfo: 'server:logger:gethInfo',
            stopGethInfo: 'server:logger:stopGethInfo'
        },
        user: {
            signUp: 'server:user:signUp',
            exists: 'server:user:exists',
            login: 'server:user:login',
            logout: 'server:user:logout',
            createCoinbase: 'server:user:createCoinbase',
            faucetEther: 'server:user:faucetEther',
            registerProfile: 'server:user:registerProfile',
            getProfileData: 'server:user:getProfileData',
            listEthAccounts: 'server:user:listEthAccounts',
            getBalance: 'server:user:getBalance'
        },
        entry: {
            publish: 'server:entry:publish'
        }
    },
    client: {
        geth: {
            startService: 'client:geth:startService',
            startSyncing: 'client:geth:startSyncing',
            syncUpdate: 'client:geth:syncUpdate',
            stopService: 'client:geth:stopService',
            contract: 'client:geth.contract'
        },
        ipfs: {
            startService: 'client:ipfs:startService',
            stopService: 'client:ipfs:stopService'
        },
        logger: {
            gethInfo: 'client:logger:gethInfo',
            stopGethInfo: 'client:logger:stopGethInfo'
        },
        user: {
            signUp: 'client:user:signUp',
            exists: 'client:user:exists',
            login: 'client:user:login',
            logout: 'client:user:logout',
            createCoinbase: 'client:user:createCoinbase',
            faucetRequestEther: 'client:user:faucetRequestEther',
            faucetEther: 'client:user:faucetEther',
            registerProfileHash: 'client:user:registerProfileHash',
            registerProfileComplete: 'client:user:registerProfileComplete',
            listEthAccounts: 'client:user:listEthAccounts',
            listEtherAccounts: 'server:user:listEtherAccounts',
            getBalance: 'client:user:getBalance'
        },
        entry: {
            publish: 'client:entry:publish'
        }
    }
};
