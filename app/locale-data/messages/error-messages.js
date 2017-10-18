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
    commentsDownvote: {
        id: 'app.error.commentsDownvote',
        description: 'comment downvote error',
        defaultMessage: 'An error occurred  while downvoting a comment'
    },
    commentsPublish: {
        id: 'app.error.commentsPublish',
        description: 'comment publish error',
        defaultMessage: 'An error occured while publishing a comment'
    },
    commentsUpvote: {
        id: 'app.error.commentsUpvote',
        description: 'comment upvote error',
        defaultMessage: 'An error occurred  while upvoting a comment'
    },
    dashboardAdd: {
        id: 'app.error.dashboardAdd',
        description: 'add dashboard error message',
        defaultMessage: 'An error occurred while saving the new dashboard'
    },
    dashboardAddColumn: {
        id: 'app.error.dashboardAddColumn',
        description: 'add column error message',
        defaultMessage: 'An error occurred while saving the new column'
    },
    dashboardDelete: {
        id: 'app.error.dashboardDelete',
        description: 'delete dashboard error message',
        defaultMessage: 'An error occurred while deleting your dashboard'
    },
    dashboardDeleteColumn: {
        id: 'app.error.dashboardDeleteColumn',
        description: 'delete column error message',
        defaultMessage: 'An error occurred while deleting your column'
    },
    dashboardGetActive: {
        id: 'app.error.dashboardGetActive',
        description: 'get active dashboard error message',
        defaultMessage: 'An error occurred while getting the active dashboard'
    },
    dashboardGetAll: {
        id: 'app.error.dashboardGetAll',
        description: 'get all dashboards error message',
        defaultMessage: 'An error occurred while getting your dashboards'
    },
    dashboardSetActive: {
        id: 'app.error.dashboardSetActive',
        description: 'set active dashboard error message',
        defaultMessage: 'An error occurred while saving your active dashboard'
    },
    dashboardUpdateColumn: {
        id: 'app.error.dashboardUpdateColumn',
        description: 'update column error message',
        defaultMessage: 'An error occurred while updating your column'
    },
    draftAutosave: {
        id: 'app.error.draftAutosave',
        description: 'draft autosave error message',
        defaultMessage: 'Cannot save latest changes of this draft!'
    },
    draftPublish: {
        id: 'app.error.draftPublish',
        description: 'draft publish error message',
        defaultMessage: 'An error occured while publishing draft'
    },
    entriesGetAsDrafts: {
        id: 'app.error.entriesGetAsDrafts',
        description: 'entries get as drafts error',
        defaultMessage: 'There was an error when trying to fetch your entries! Showing local drafts only!',
    },
    entryClaim: {
        id: 'app.error.entryClaim',
        description: 'claim entry balance error message',
        defaultMessage: 'An error occurred while claiming {entryTitle}'
    },
    entryDownvote: {
        id: 'app.error.entryDownvote',
        description: 'downvote entry error message',
        defaultMessage: 'An error occurred while downvoting {entryTitle}'
    },
    entryGetFull: {
        id: 'app.error.entryGetFull',
        description: 'get full entry error message',
        defaultMessage: 'An error occurred while getting entry data'
    },
    entryUpvote: {
        id: 'app.error.entryUpvote',
        description: 'upvote entry error message',
        defaultMessage: 'An error occurred while upvoting {entryTitle}'
    },
    errorNotificationTitle: {
        id: 'app.error.errorNotificationTitle',
        description: 'title for error notifcations',
        defaultMessage: 'Error code {errorCode}'
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
    unexpectedError: {
        id: 'app.error.unexpectedError',
        description: 'an error with no code',
        defaultMessage: 'Unexpected Error'
    },
    profileBondAeth: {
        id: 'app.error.profileBondAeth',
        description: 'bond/manafy aeth error',
        defaultMessage: 'An error occured while manafying {amount} AETH'
    },
    profileCycleAeth: {
        id: 'app.error.profileCycleAeth',
        description: 'cycle aeth error',
        defaultMessage: 'An error occured while cycling {amount} AETH'
    },
    profileGetLocal: {
        id: 'app.error.profileGetLocal',
        description: 'get local profiles error',
        defaultMessage: 'An error occured while fetching local profiles'
    },
    profileGetList: {
        id: 'app.error.profileGetList',
        description: 'get profiles list error',
        defaultMessage: 'An error occured while getting the list of profiles'
    },
    profileTransferAeth: {
        id: 'app.error.profileTransferAeth',
        description: 'transfer AETH error',
        defaultMessage: 'An error occured while transferring {tokenAmount} AETH'
    },
    profileTransferEth: {
        id: 'app.error.profileTransferEth',
        description: 'transfer ETH error',
        defaultMessage: 'An error occured while transferring {value} ETH'
    },
    saveGeneralSettings: {
        id: 'app.error.saveGeneralSettings',
        description: 'save general settings error message',
        defaultMessage: 'An error occurred while saving your settings'
    },
});

export { errorMessages };
