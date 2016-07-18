// PAYLOADS
// Standard communication server => client


sender.send('channelName', { status, success, data })

`status: 'object': {
    message: 'string' 'A hardcoded message', // this message should be displayed to user
    error: 'string' This should be the stackTrace // mostly for development, we can hide in production
}`

`success: 'boolean'`

`data: 'object or array'`;


export const EVENTS = {
    TO_SERVER: {
        geth: {
            startService: 'no parameter' || 'object with these keys: cache, ipcPath, dataDir, extra',
            stopService: 'no parameter',
            contract: 'This should be removed, have you any idea what it is supposed to do?'
        },
        ipfs: {
            startService: 'no parameter' || 'object with 1 key: repoDir, but we don\'t use it for now',
            stopService: 'no parameter'
        },
        logger: {
            gethInfo: 'no parameter' || 'a boolean, if true it will keep sending lines from the logs',
            stopGethInfo: 'no parameter'
        },
        user: {
            exists: 'object with key: username',
            login: 'object with keys: account, password, interval[optional]',
            logout: 'object with key: account',
            createCoinbase: 'object with key: password',
            faucetEther: 'object with key: account[optional]',
            getIpfsImage: 'object with ipfsHash key',
            registerProfile: 'object with keys. '
                    `{
                        account: 'string',
                        password: 'Uint8Array',
                        firstName: 'string',
                        lastName: 'string',
                        userName: 'string',
                        optionalData: 'object' : {
                            about: 'string',
                            links: [{
                                id: 'number',
                                title: 'string',
                                type:  'string' one of ('internal', 'other'),
                                url: 'string'
                            }],
                            avatar: ArrayBuffer,
                            coverImage: [
                                [...], => represents a single image with multiple resolution dimensions
                                [
                                    { => this is a sigle variant
                                        height: 'number',
                                        width: 'number',
                                        key: 'string' one of ('small', med, xmed, large, xlarge),
                                        imageFile: ArrayBuffer
                                    },
                                    {...},
                                    {...}
                                    // when image width is larger than 1920 there will be 6 variants
                                ],
                                [...]
                            ]
                        }
                    }`,
            listEthAccounts: 'no parameter',
            getProfileData: 'object' 
            `{
                ipfsHash: 'string'
            }`,
            getBalance: 'object with key: account[optional]'
        },
        entry: {
            publish: 'object' `{
                status: 'string' one of ('draft', 'published'),
                visibility: 'string' one of ('public', 'private'), //can be extended in future
                title: 'string',
                featuredImage: 'unknown yet. must be discussed',
                tags: 'array' [
                    {}, => 1 tag
                    {
                        id: 'tag id UUID ?'
                        name: 'string',
                        description?: 'string',
                        ...
                    }
                ],
                excerpt: 'string',
                licence: 'object': {
                    name: '',
                    id: 'uuid',
                    description: 'string'
                },
                body: 'object': {
                    entityMap: { //all entities like images, videos etc.
                        0: {
                            "type": "image", // this is a image inside article body
                            "mutability": "IMMUTABLE",
                            "data": { // actual image
                                "key": "mlarge",
                                "imageFile": ArrayBuffer,
                                "width": 1280,
                                "height": 868
                          }
                    },
                    blocks: [ // blocks are lines inside editor
                        {...}, => line 1
                        {
                            key: 'string',
                            text: 'string',
                            type: 'string',
                            .... other metadata
                        }, => line 2
                        {...} => line 3
                        ....
                    ] 

                }
            }`,
            tagExists: `{
                tag: string
            }`,
            addTags: `{
                tags: array of strings
            }`
        }
    },
    TO_CLIENT: {// All messages are objects with success key a boolean true - it worked, false - it failed
        // The other key is status, and that is detailed below
        geth: {
            startService: 'object with the keys&values sent TO_SERVER',
            startSyncing: 'string message',
            syncUpdate: `object with keys: currentBlock, highestBlock, startingBlock, peerCount
                        or an object with key "empty" and value true`,
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
            exists: `{
                exists: boolean
            }`,
            login: 'string message',
            logout: 'string message',
            createCoinbase: 'boolean true',
            faucetRequestEther: 'string txHash',
            faucetEther: 'object with tx JSON',
            registerProfileHash: 'string txHash',
            registerProfileComplete: 'object with tx Object',
            getIpfsImage: 'an ArrayBuffer',
            listAccounts: 'array with accounts':
                `[
                    {
                        ethAddress: 'String'
                        ipfsHash: 'String'
                    }, {
                        ...
                    }
                ]`,
            getProfileData: 'object'
            `{
                userName: 'String',
                firstName: 'String',
                lastName: 'String',
                optionalData: {...},
                ...
            }`
            listEtherAccounts: 'array with accounts [string eth addresses]',
            getBalance: 'string with the sum in ETH'
        },
        entry: {
            publish: `{
                same obj sent to server +,
                ipfsHash: string
            }`,
            tagExists: {
                exists: boolean,
                tag: string
            },
            addTags: `{
                tx: string,
                tag: string
            }`
        }
    }
};
