
export const EVENTS = {
    TO_SERVER: {
        geth: {
            startService: 'no parameter' || 'object with these keys: cache, ipcPath, dataDir, extra'
            stopService: 'no parameter',
            contract: 'This should be removed, have you any idea what it is supposed to do?'
        },
        ipfs: {
            startService: 'no parameter' || 'object with 1 key: repoDir, but we don\'t use it for now'
            stopService: 'no parameter'
        },
        logger: {
            gethInfo: 'no parameter' || 'a boolean, if true it will keep sending lines from the logs'
            stopGethInfo: 'no parameter'
        },
        user: {
            exists: 'object with key: username',
            login: 'object with keys: account, password, interval[optional]',
            logout: 'object with key: account',
            createCoinbase: 'object with key: password',
            faucetEther: 'object with key: account[optional]',
            registerProfile: 'object with keys. Sever should fill this up',
            listAccounts: 'no parameter',
            getProfileDetails: 'object with key: account[optional]',
            listEtherAccounts: 'no parameter',
            getBalance: 'object with key: account[optional]'
        },
        entry: {
            publish: 'object with keys. Sever should fill this up'
        }
    },
    TO_CLIENT: {// All messages are objects with success key a boolean true - it worked, false - it failed
        // The other key is status, and that is detailed below
        geth: {
            startService: 'object with the keys&values sent TO_SERVER',
            startSyncing: 'string message',
            syncUpdate: 'object with keys: currentBlock, highestBlock, startingBlock, peerCount',
            stopService: 'null',
            contract: 'This should be removed, have you any idea what it is supposed to do?'
        },
        ipfs: {
            startService: 'object with the keys used when sent TO_SERVER + ipfsMessage key',
            stopService: 'object with the keys&values sent TO_SERVER'
        },
        logger: {
            gethInfo: 'object with data from the logs - array of JSONs 1 JSON {message, level, timestamp} per line',
            stopGethInfo: 'I don\'t send anything back. Do you need anything here?'
        },
        user: {
            exists: 'boolean',
            login: 'string message',
            logout: 'string message',
            createCoinbase: 'boolean true',
            faucetRequestEther: 'string txHash',
            faucetEther: 'object with tx JSON',
            registerProfileHash: 'string txHash',
            registerProfileComplete: 'object with tx Object',
            listAccounts: 'array with accounts [JSONs with eth addresses, usernames - only what\'s in the AkashaRegistry contract]',
            listEtherAccounts: 'array with accounts [string eth addresses]',
            getBalance: 'string with the sum in ETH'
        },
        entry: {
            publish: '...'
        }
    }
};
