import { defineMessages } from 'react-intl';

const setupMessages = defineMessages({
    authComplete: {
        id: 'app.setup.authComplete',
        description: 'title for complete profile setup page',
        defaultMessage: 'The authentication process was completed!'
    },
    backup: {
        id: 'app.setup.backup',
        description: 'backup button label',
        defaultMessage: 'Backup keys'
    },
    completeProfile: {
        id: 'app.setup.completeProfile',
        description: 'description for profile complete setup page',
        defaultMessage: 'To enjoy the full experience, complete your profile now!'
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
    gethIPCPath: {
        id: 'app.setup.gethIPCPath',
        description: 'geth IPC path input placeholder',
        defaultMessage: 'Geth IPC path'
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
    importKeys: {
        id: 'app.setup.importKeys',
        description: 'Label for import keys button',
        defaultMessage: 'Import keys'
    },
    ipfsStoragePath: {
        id: 'app.setup.ipfsStoragePath',
        description: 'IPFS input field label',
        defaultMessage: 'IPFS storage path'
    },
    ipfsApiPort: {
        id: 'app.setup.ipfsApiPort',
        description: 'IPFS API port input field label',
        defaultMessage: 'IPFS API port'
    },
    ipfsGatewayPort: {
        id: 'app.setup.ipfsGatewayPort',
        description: 'IPFS gateway port input field label',
        defaultMessage: 'IPFS gateway port'
    },
    ipfsSwarmPort: {
        id: 'app.setup.ipfsSwarmPort',
        description: 'IPFS swarm port input field label',
        defaultMessage: 'IPFS swarm port'
    },
    configuration: {
        id: 'app.setup.configuration',
        description: 'panel header for configuration page',
        defaultMessage: 'Configuration'
    },
    lightSync: {
        id: 'app.setup.lightSync',
        description: 'geth light sync option',
        defaultMessage: 'Light sync'
    },
    lightSyncDescription: {
        id: 'app.setup.lightSyncDescription',
        description: 'info when user selects light sync mode',
        defaultMessage: '...'
    },
    newIdentitySubtitle: {
        id: 'app.setup.newIdentitySubtitle',
        description: 'subtitle for new identity page',
        defaultMessage: 'Please enter your passphrase below'
    },
    normalSync: {
        id: 'app.setup.normalSync',
        description: 'geth normal sync option',
        defaultMessage: 'Normal sync'
    },
    normalSyncDescription: {
        id: 'app.setup.normalSyncDescription',
        description: 'info when user selects normal sync mode',
        defaultMessage: `Congratulations, you are a pioneer synchronizing with the Ethereum test network! We recommend Normal Sync with the Express setup but the brave ones can also choose the (very) experimental Light Sync! :)`
    },
    normalSyncDescriptionAlt: {
        id: 'app.setup.normalSyncDescriptionAlt',
        description: 'more info',
        defaultMessage: 'We recommend Normal Sync with the Express setup. The brave ones can also choose the experimental Light Sync.'
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
    interestedIn: {
        id: 'app.setup.interestedIn',
        description: 'title for new identity interests page',
        defaultMessage: 'What are you interested in?'
    },
    interestSuggestion: {
        id: 'app.setup.interestSuggestion',
        description: 'description for new identity interests page',
        defaultMessage: 'We\'ll suggest incredible stuff to read based on your interests.'
    },
    expressSetup: {
        id: 'app.setup.expressSetup',
        description: 'Express setup option checkbox',
        defaultMessage: 'Express setup'
    },
    faucetPending: {
        id: 'app.setup.faucetPending',
        description: 'message shown while faucet tx is pending',
        defaultMessage: 'You will receive test ethers shortly...'
    },
    faucetError: {
        id: 'app.setup.faucetError',
        description: 'message shown when faucet tx fails',
        defaultMessage: 'Something went wrong!'
    },
    faucetRetry: {
        id: 'app.setup.faucetRetry',
        description: 'message shown when faucet tx fails to allow user to retry the tx',
        defaultMessage: 'Try again here'
    },
    faucetSuccess: {
        id: 'app.setup.faucetSuccess',
        description: 'message shown on faucet tx success',
        defaultMessage: 'You now have test ethers in your balance.'
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
        description: 'message shown when synchronizing with the blockchain',
        defaultMessage: 'Synchronizing'
    },
    syncStopped: {
        id: 'app.setup.syncStopped',
        description: 'message shown when synchronization was stopped',
        defaultMessage: 'Synchronization was stopped'
    },
    syncCompleted: {
        id: 'app.setup.syncCompleted',
        description: 'message shown when synchronization is completed',
        defaultMessage: 'Synchronization completed'
    },
    syncPaused: {
        id: 'app.setup.syncPaused',
        description: 'message shown when synchronization is completed',
        defaultMessage: 'Synchronization is paused'
    },
    onSyncStart: {
        id: 'app.setup.onSyncStart',
        description: 'Message to show when synchronizing',
        defaultMessage: 'You will be able to log in and enjoy the full experience as soon as the sync is complete! We are waiting for you on the other side! o/'
    },
    afterSyncFinish: {
        id: 'app.setup.afterSyncFinish',
        description: 'Message to show after synchronization has finished',
        defaultMessage: `Synchronization is complete. IPFS service needs to be started in order to
                        continue. You can start it manually from the status bar in the header or
                        click NEXT to start it automatically.`
    },
    noProfilesFound: {
        id: 'app.setup.noProfilesFound',
        description: 'placeholder message shown if no local profiles were found',
        defaultMessage: 'No profiles found. Create a new identity or import an existing one.'
    },
    findingPeers: {
        id: 'app.setup.findingPeers',
        description: 'finding peers',
        defaultMessage: 'Finding peers'
    },
    launchingServices: {
        id: 'app.setup.launchingServices',
        description: 'message to display when geth and IPFS services are about to start',
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
        description: 'number of peers connected',
        defaultMessage: `{peerCount, number} {peerCount, plural,
            one {peer}
            few {peers}
            many {peers}
            other {peers}
        } {peerCount, plural,
            one {connected}
            other {connected}
        }`
    },
    details: {
        id: 'app.setup.details',
        description: 'details button label',
        defaultMessage: 'details'
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
    },
    tutorialTitle: {
        id: 'app.setup.tutorialTitle',
        description: 'title for tutorial Modal',
        defaultMessage: 'A few tips before you get started'
    },
    tutorialEth: {
        id: 'app.setup.tutorialEth',
        description: 'text for tutorial Modal',
        defaultMessage: 'This dapp uses test ETH (ether) so please DO NOT send real ETH to in-dapp addresses.'
    },
    tutorialMana: {
        id: 'app.setup.tutorialMana',
        description: 'text for tutorial Modal',
        defaultMessage: 'The dapp requieres Manafied AETH (mana) for interactions. You can obtain Mana by clicking your AETH balance in the upper right side, selecting Manafy in the Transform tab.'
    },
    tutorialManaAlt: {
        id: 'app.setup.tutorialManaAlt',
        description: 'text for tutorial Modal',
        defaultMessage: 'Alternatively, you can click the sidebar Mana indicator next to your avatar photo.'
    },
});

export { setupMessages };
