import { defineMessages } from 'react-intl';

const setupMessages = defineMessages({
    backup: {
        id: 'app.setup.backup',
        description: 'backup button label',
        defaultMessage: 'Backup keys'
    },
    changeGethDataDir: {
        id: 'app.setup.changeGethDataDir',
        description: 'Label for changing geth data directory',
        defaultMessage: 'Change this if geth has different data directory'
    },
    createIdentity: {
        id: 'app.setup.createIdentity',
        description: 'Create identity button label',
        defaultMessage: 'Create new identity'
    },
    gethDataDirPath: {
        id: 'app.setup.gethDataDirPath',
        description: 'geth datadir path field label',
        defaultMessage: 'Geth Datadir path'
    },
    changeGethAlreadyStarted: {
        id: 'app.setup.changeGethAlreadyStarted',
        description: 'input field placeholder text',
        defaultMessage: 'Change this if geth is already started with --ipcpath'
    },
    gethIPCPath: {
        id: 'app.setup.gethIPCPath',
        description: 'geth ipc path input placeholder',
        defaultMessage: 'Geth IPC Path'
    },
    gethCacheSize: {
        id: 'app.setup.gethCacheSize',
        description: 'geth cache size input placeholder',
        defaultMessage: 'Geth cache size'
    },
    gethNetworkId: {
        id: 'app.setup.gethNetworkId',
        description: 'geth network id placeholder',
        defaultMessage: 'Geth network id'
    },
    gethAutodag: {
        id: 'app.setup.gethAutodag',
        description: 'geth autodag flag',
        defaultMessage: 'Autodag'
    },
    gethFast: {
        id: 'app.setup.gethFast',
        description: 'geth fast flag',
        defaultMessage: 'Fast'
    },
    gethMine: {
        id: 'app.setup.gethMine',
        description: 'geth mine flag',
        defaultMessage: 'Mine'
    },
    gethMinerThreads: {
        id: 'app.setup.gethMinerThreads',
        description: 'number of threads used for mining',
        defaultMessage: 'Miner threads'
    },
    importKeys: {
        id: 'app.setup.importKeys',
        description: 'Label for import keys button',
        defaultMessage: 'Import keys'
    },
    changeIfIpfsRunning: {
        id: 'app.setup.changeIfIpfsRunning',
        description: 'ipfs input field placeholder',
        defaultMessage: 'Change this if ipfs daemon is already running'
    },
    changeGethCacheSize: {
        id: 'app.setup.changeGethCacheSize',
        description: 'geth cache size input label',
        defaultMessage: 'Change geth cache size (min. 512MB)'
    },
    gethCacheSizeError: {
        id: 'app.setup.gethCacheSizeError',
        description: 'error shown when user sets a cache size lower than 512mb',
        defaultMessage: 'Cache size should not be less than 512Mb'
    },
    ipfsStoragePath: {
        id: 'app.setup.ipfsStoragePath',
        description: 'ipfs input field label',
        defaultMessage: 'IPFS storage path'
    },
    changeIpfsStoragePath: {
        id: 'app.setup.changeIpfsStoragePath',
        description: 'ipfs input field label',
        defaultMessage: 'Change IPFS directory'
    },
    ipfsApiPort: {
        id: 'app.setup.ipfsApiPort',
        description: 'ipfs input field label',
        defaultMessage: 'IPFS API port'
    },
    ipfsGatewayPort: {
        id: 'app.setup.ipfsGatewayPort',
        description: 'ipfs input field label',
        defaultMessage: 'IPFS gateway port'
    },
    ipfsSwarmPort: {
        id: 'app.setup.ipfsSwarmPort',
        description: 'ipfs input field label',
        defaultMessage: 'IPFS swarm port'
    },
    firstTimeSetupTitle: {
        id: 'app.setup.firstTimeSetupTitle',
        description: 'title for first time setup page',
        defaultMessage: 'First time setup'
    },
    configuration: {
        id: 'app.setup.configuration',
        description: 'panel header for configuration page',
        defaultMessage: 'Configuration'
    },
    lightSync: {
        id: 'app.setup.lightSync',
        description: 'light sync option',
        defaultMessage: 'Light sync'
    },
    normalSync: {
        id: 'app.setup.normalSync',
        description: 'normal sync option',
        defaultMessage: 'Normal sync'
    },
    synchronization: {
        id: 'app.setup.synchronization',
        description: 'panel header for synchronization page',
        defaultMessage: 'Synchronization'
    },
    syncOptions: {
        id: 'app.setup.syncOptions',
        description: 'title for synchronization options',
        defaultMessage: 'Sync options'
    },
    logDetails: {
        id: 'app.setup.logDetails',
        description: 'panel header for log details page',
        defaultMessage: 'Log details'
    },
    login: {
        id: 'app.setup.login',
        description: 'title for login page',
        defaultMessage: 'Login'
    },
    welcomeBack: {
        id: 'app.setup.welcomeBack',
        description: 'auth page title',
        defaultMessage: 'Welcome back!'
    },
    chooseIdentity: {
        id: 'app.setup.chooseIdentity',
        description: 'subtitle for login page',
        defaultMessage: 'Please select one identity to login'
    },
    newIdentity: {
        id: 'app.setup.newIdentity',
        description: 'panel header for new identity page',
        defaultMessage: 'Create new identity'
    },
    akashaNextGenNetwork: {
        id: 'app.setup.akashaNextGenNetwork',
        description: 'akasha next gen description',
        defaultMessage: `AKASHA is a next-generation social blogging network powered by a new
                        kind of world computer known as Ethereum and the
                        Inter Planetary File System.`
    },
    youHaveNotHeared: {
        id: 'app.setup.youHavenNotHeared',
        description: 'You have not heard about these :)',
        defaultMessage: `If you haven’t heard of these technologies before don’t worry, simply
                        click next and we’ll take care of the rest.`
    },
    ifYouHaveEth: {
        id: 'app.setup.ifYouHaveEth',
        description: 'if you already have Ethereum',
        defaultMessage: `If you already have the Ethereum Go client or IPFS installed on your
                        machine please choose the advanced option.`
    },
    expressSetup: {
        id: 'app.setup.expressSetup',
        description: 'Express setup option checkbox',
        defaultMessage: 'Express setup'
    },
    advancedSetup: {
        id: 'app.setup.advancedSetup',
        description: 'Advanced setup option checkbox',
        defaultMessage: 'Advanced'
    },
    downloadingGeth: {
        id: 'app.setup.downloadingGeth',
        description: 'message shown when geth is downloading',
        defaultMessage: 'Downloading Geth client...'
    },
    downloadingIpfs: {
        id: 'app.setup.downloadingIpfs',
        description: 'message shown when IPFS is downloading',
        defaultMessage: 'Downloading IPFS client...'
    },
    startingGeth: {
        id: 'app.setup.startingGeth',
        description: 'message shown when Geth is starting',
        defaultMessage: 'Starting Geth client...'
    },
    upgradingGeth: {
        id: 'app.setup.upgradingGeth',
        description: 'message shown when Geth is upgrading',
        defaultMessage: 'Upgrading Geth client...'
    },
    upgradingIpfs: {
        id: 'app.setup.upgradingIpfs',
        description: 'message shown when IPFS is upgrading',
        defaultMessage: 'Upgrading IPFS client...'
    },
    processing: {
        id: 'app.setup.processing',
        description: 'message shown when processing blocks',
        defaultMessage: 'Processing'
    },
    synchronizing: {
        id: 'app.setup.synchronizing',
        description: 'state of block sync',
        defaultMessage: 'Synchronizing'
    },
    syncStopped: {
        id: 'app.setup.syncStopped',
        description: 'state of block sync',
        defaultMessage: 'Synchronization was stopped'
    },
    syncCompleted: {
        id: 'app.setup.syncCompleted',
        description: 'state of block sync',
        defaultMessage: 'Synchronization completed'
    },
    syncPaused: {
        id: 'app.setup.syncPaused',
        description: 'state of block sync',
        defaultMessage: 'Synchronization is paused'
    },
    syncResuming: {
        id: 'app.setup.syncResuming',
        description: 'state of block sync',
        defaultMessage: 'Resuming synchronization...'
    },
    disconnected: {
        id: 'app.setup.disconnected',
        description: 'disconnected',
        defaultMessage: 'Disconnected'
    },
    beforeSyncStart: {
        id: 'app.setup.beforeSyncStart',
        description: 'Message to show before sync is starting',
        defaultMessage: `We are starting synchronization with the Ethereum world computer.
                        Please be patient.`
    },
    onSyncStart: {
        id: 'app.setup.onSyncStart',
        description: 'Message to show when synchronizing',
        defaultMessage: `Your machine is currently synchronizing with the Ethereum world computer
                        network. You will be able to log in and enjoy the full AKASHA experience as
                        soon as the sync is complete.`
    },
    afterSyncFinish: {
        id: 'app.setup.afterSyncFinish',
        description: 'Message to show after synchronization has finished',
        defaultMessage: `Synchronization is complete. IPFS service needs to be started in order to
                        continue. You can start it manually from the status bar in the header or
                        click NEXT to start it automatically.`
    },
    initializingTitle: {
        id: 'app.setup.initializingTitle',
        description: 'Title for initializing state page',
        defaultMessage: 'Initializing'
    },
    noProfilesFound: {
        id: 'app.setup.noProfilesFound',
        description: 'message if no local profiles found.',
        defaultMessage: 'No profiles found. Create a new identity or import an existing one.'
    },
    findingProfiles: {
        id: 'app.setup.findingProfiles',
        description: 'when we are trying to discover local profiles with akasha account',
        defaultMessage: 'Finding profiles..'
    },
    findingPeers: {
        id: 'app.setup.findingPeers',
        description: 'finding peers status',
        defaultMessage: 'Finding peers'
    },
    launchingServices: {
        id: 'app.setup.launchingServices',
        description: 'message to display when both services are stopped',
        defaultMessage: 'Launching services'
    },
    waitingForServices: {
        id: 'app.setup.waitingForServices',
        description: 'default message to display in sync status',
        defaultMessage: 'Waiting for services'
    },
    waitingForGeth: {
        id: 'app.setup.waitingForGeth',
        description: 'message to display when synchronization is in default state',
        defaultMessage: 'Waiting for geth client'
    },
    peerCount: {
        id: 'app.setup.peerCount',
        description: 'counting connected peers',
        defaultMessage: `{peerCount, number} {peerCount, plural,
            one {peer}
            few {peers}
            many {peers}
            other {peers}
        }, {peerCount, plural,
            one {connected}
            other {connected}
        }`
    },
    peers: {
        id: 'app.setup.peers',
        description: 'base plural form of peer',
        defaultMessage: 'peers'
    },
    details: {
        id: 'app.setup.details',
        description: 'details button label',
        defaultMessage: 'details'
    },
    retry: {
        id: 'app.setup.retry',
        description: 'try again',
        defaultMessage: 'Retry'
    },
    retryStep: {
        id: 'app.setup.retryStep',
        description: 'retry current step',
        defaultMessage: 'Retry Step'
    },
    identityRegistered: {
        id: 'app.setup.identityRegistered',
        description: 'panel title when identity registered',
        defaultMessage: 'Identity Registered!'
    },
    gethStopped: {
        id: 'app.setup.gethStopped',
        description: 'message to be displayed when geth is stopped and profiles cannot be loaded',
        defaultMessage: `Geth service is not working. Please start it manually in order to fetch
                        your profiles.`
    },
    ipfsStopped: {
        id: 'app.setup.ipfsStopped',
        description: 'message to be displayed when ipfs is stopped and profiles cannot be loaded',
        defaultMessage: `IPFS service is stopped. Please start it manually in order to fetch
                        your profiles.`
    }
});

export { setupMessages };
