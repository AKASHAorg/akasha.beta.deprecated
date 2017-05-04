import { defineMessages } from 'react-intl';

const errorMessages = defineMessages({
    reportErrorTitle: {
        id: 'app.error.reportErrorTitle',
        description: 'title for report modal',
        defaultMessage: 'Report error'
    },
    thankYouForYourFeedback: {
        id: 'app.error.thankYouForYourFeedback',
        description: 'thank you for feedback',
        defaultMessage: 'Thank you for your feedback!'
    },
    copyTheFollowingLines: {
        id: 'app.error.copyTheFollowingLines',
        description: 'text explaining what to do to report an issue on GH',
        defaultMessage: 'Please copy the following lines and create a new issue on { githubLink }.'
    },
    alsoCheckForOpenedIssues: {
        id: 'app.error.alsoCheckForOpenedIssues',
        description: 'text suggesting to check for existing issues',
        defaultMessage: 'Also check if there are no already opened issues regarding this error!'
    },
    backupKeys: {
        id: 'app.error.backupKeys',
        description: 'backup keys error message',
        defaultMessage: 'Generating backup has failed. Try again'
    },
    fatalError: {
        id: 'app.error.fatalError',
        description: 'title for fatal error modal',
        defaultMessage: 'Fatal error'
    },
    generalSettings: {
        id: 'app.error.generalSettings',
        description: 'get general settings error',
        defaultMessage: 'An error occurred while getting your general settings'
    },
    gethGetOptions: {
        id: 'app.error.gethGetOptions',
        description: 'geth options error message',
        defaultMessage: 'An error occurred while getting geth service options'
    },
    gethGetStatus: {
        id: 'app.error.gethGetStatus',
        description: 'geth get status error message',
        defaultMessage: 'An error occurred while getting geth service status'
    },
    gethGetSyncStatus: {
        id: 'app.error.gethGetSyncStatus',
        description: 'geth get sync status error message',
        defaultMessage: 'An error occurred while getting synchronization status'
    },
    gethSaveSettings: {
        id: 'app.error.gethSaveSettings',
        description: 'geth save settings error',
        defaultMessage: 'An error occurred while saving your geth settings'
    },
    gethSettings: {
        id: 'app.error.gethSettings',
        description: 'geth get settings error',
        defaultMessage: 'An error occurred while getting your geth settings'
    },
    gethStart: {
        id: 'app.error.gethStart',
        description: 'start geth error message',
        defaultMessage: 'Geth service could not be started'
    },
    gethStop: {
        id: 'app.error.gethStop',
        description: 'stop geth error message',
        defaultMessage: 'Geth service could not be stopped'
    },
    ipfsGetConfig: {
        id: 'app.error.ipfsGetConfig',
        description: 'ipfs config error message',
        defaultMessage: 'An error occurred while getting ipfs service config'
    },
    ipfsGetPorts: {
        id: 'app.error.ipfsGetPorts',
        description: 'ipfs get ports error message',
        defaultMessage: 'An error occurred while getting ipfs service ports'
    },
    ipfsSaveSettings: {
        id: 'app.error.ipfsSaveSettings',
        description: 'ipfs save settings error',
        defaultMessage: 'An error occurred while saving your ipfs settings'
    },
    ipfsSetPorts: {
        id: 'app.error.ipfsSetPorts',
        description: 'ipfs set ports error message',
        defaultMessage: 'An error occurred while setting ipfs service ports'
    },
    ipfsSettings: {
        id: 'app.error.ipfsSettings',
        description: 'ipfs get settings error',
        defaultMessage: 'An error occurred while getting your ipfs settings'
    },
    ipfsStart: {
        id: 'app.error.ipfsStart',
        description: 'start ipfs error message',
        defaultMessage: 'IPFS service could not be started'
    },
    ipfsGetStatus: {
        id: 'app.error.ipfsGetStatus',
        description: 'ipfs get status error message',
        defaultMessage: 'An error occurred while getting ipfs service status'
    },
    ipfsStop: {
        id: 'app.error.ipfsStop',
        description: 'stop ipfs error message',
        defaultMessage: 'IPFS service could not be stopped'
    },
    saveGeneralSettings: {
        id: 'app.error.saveGeneralSettings',
        description: 'save general settings error message',
        defaultMessage: 'An error occurred while saving your settings'
    },
});
export { errorMessages };
