import { defineMessages } from 'react-intl';

const errorMessages = defineMessages({
    reportErrorTitle: {
        id: 'app.error.reportErrorTitle',
        description: 'title for report error modal',
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
        description: 'error message for backup keys action',
        defaultMessage: 'Generating backup has failed. Try again'
    },
    commentsDownvote: {
        id: 'app.error.commentsDownvote',
        description: 'error message for downvoting a comment',
        defaultMessage: 'An error occurred while downvoting a comment'
    },
    commentsPublish: {
        id: 'app.error.commentsPublish',
        description: 'error message for publishing a comment',
        defaultMessage: 'An error occured while publishing a comment'
    },
    commentsUpvote: {
        id: 'app.error.commentsUpvote',
        description: 'error message for upvoting a comment',
        defaultMessage: 'An error occurred while upvoting a comment'
    },
    dashboardAdd: {
        id: 'app.error.dashboardAdd',
        description: 'error message for creating a new board',
        defaultMessage: 'An error occurred while saving the new board'
    },
    dashboardAddColumn: {
        id: 'app.error.dashboardAddColumn',
        description: 'error message for adding a column to a board',
        defaultMessage: 'An error occurred while saving the new column'
    },
    dashboardDelete: {
        id: 'app.error.dashboardDelete',
        description: 'error message for deleting a board',
        defaultMessage: 'An error occurred while deleting your board'
    },
    dashboardDeleteColumn: {
        id: 'app.error.dashboardDeleteColumn',
        description: 'error message for removing a column from a board',
        defaultMessage: 'An error occurred while deleting your column'
    },
    dashboardGetActive: {
        id: 'app.error.dashboardGetActive',
        description: 'error message for fetching the active board',
        defaultMessage: 'An error occurred while getting the active board'
    },
    dashboardGetAll: {
        id: 'app.error.dashboardGetAll',
        description: 'error message for fetching all boards',
        defaultMessage: 'An error occurred while getting your boards'
    },
    dashboardSetActive: {
        id: 'app.error.dashboardSetActive',
        description: 'error message for setting the active board',
        defaultMessage: 'An error occurred while saving your active board'
    },
    dashboardUpdateColumn: {
        id: 'app.error.dashboardUpdateColumn',
        description: 'error message for updating a column',
        defaultMessage: 'An error occurred while updating your column'
    },
    draftAutosave: {
        id: 'app.error.draftAutosave',
        description: 'error message for autosaving a draft',
        defaultMessage: 'Cannot save latest changes of this draft'
    },
    draftPublish: {
        id: 'app.error.draftPublish',
        description: 'error message for publishing a draft',
        defaultMessage: 'An error occured while publishing your draft'
    },
    entriesGetAsDrafts: {
        id: 'app.error.entriesGetAsDrafts',
        description: 'error message for fetching your own entries',
        defaultMessage: 'An error occured while trying to fetch your entries. Showing local drafts only',
    },
    entryClaim: {
        id: 'app.error.entryClaim',
        description: 'error message for collecting Essence for an entry',
        defaultMessage: 'An error occurred while collecting Essence for {entryTitle}'
    },
    entryClaimVote: {
        id: 'app.error.entryClaimVote',
        description: 'error message for collecting Essence for a vote',
        defaultMessage: 'An error occurred while collecting Essence for {entryTitle}'
    },
    entryDownvote: {
        id: 'app.error.entryDownvote',
        description: 'error message for downvoting an entry',
        defaultMessage: 'An error occurred while downvoting {entryTitle}'
    },
    entryGetFull: {
        id: 'app.error.entryGetFull',
        description: 'error message for fetching a full entry',
        defaultMessage: 'An error occurred while getting entry data'
    },
    entryListIterator: {
        id: 'app.error.entryListIterator',
        description: 'error message for fetching entries in a list',
        defaultMessage: 'An error occurred while getting entries in a list'
    },
    entryUpvote: {
        id: 'app.error.entryUpvote',
        description: 'error message for upvoting an entry',
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
        description: 'error message for fetching general settings',
        defaultMessage: 'An error occurred while getting your general settings'
    },
    gethGetOptions: {
        id: 'app.error.gethGetOptions',
        description: 'error message for fetching geth options',
        defaultMessage: 'An error occurred while getting geth service options'
    },
    gethGetStatus: {
        id: 'app.error.gethGetStatus',
        description: 'error message for fetching geth status',
        defaultMessage: 'An error occurred while getting geth service status'
    },
    gethGetSyncStatus: {
        id: 'app.error.gethGetSyncStatus',
        description: 'error message for fetching geth synchronization status',
        defaultMessage: 'An error occurred while getting synchronization status'
    },
    gethSaveSettings: {
        id: 'app.error.gethSaveSettings',
        description: 'error message for saving geth settings',
        defaultMessage: 'An error occurred while saving your geth settings'
    },
    gethSettings: {
        id: 'app.error.gethSettings',
        description: 'error message for fetching geth settings',
        defaultMessage: 'An error occurred while getting your geth settings'
    },
    gethStart: {
        id: 'app.error.gethStart',
        description: 'error message for starting geth service',
        defaultMessage: 'Geth service could not be started'
    },
    gethStop: {
        id: 'app.error.gethStop',
        description: 'error message for stopping geth service',
        defaultMessage: 'Geth service could not be stopped'
    },
    ipfsGetConfig: {
        id: 'app.error.ipfsGetConfig',
        description: 'error message for fetching IPFS service configuration',
        defaultMessage: 'An error occurred while getting IPFS service config'
    },
    ipfsGetPorts: {
        id: 'app.error.ipfsGetPorts',
        description: 'error message for fetching IPFS ports',
        defaultMessage: 'An error occurred while getting IPFS service ports'
    },
    ipfsSaveSettings: {
        id: 'app.error.ipfsSaveSettings',
        description: 'error message for saving IPFS settings',
        defaultMessage: 'An error occurred while saving your IPFS settings'
    },
    ipfsSetPorts: {
        id: 'app.error.ipfsSetPorts',
        description: 'ipfs set ports error message',
        defaultMessage: 'An error occurred while setting ipfs service ports'
    },
    ipfsSettings: {
        id: 'app.error.ipfsSettings',
        description: 'error message for fetching IPFS settings',
        defaultMessage: 'An error occurred while getting your IPFS settings'
    },
    ipfsStart: {
        id: 'app.error.ipfsStart',
        description: 'error message for starting IPFS service',
        defaultMessage: 'IPFS service could not be started'
    },
    ipfsGetStatus: {
        id: 'app.error.ipfsGetStatus',
        description: 'error message for fetching IPFS service status',
        defaultMessage: 'An error occurred while getting IPFS service status'
    },
    ipfsStop: {
        id: 'app.error.ipfsStop',
        description: 'error message for stopping IPFS service',
        defaultMessage: 'IPFS service could not be stopped'
    },
    unexpectedError: {
        id: 'app.error.unexpectedError',
        description: 'a general error (with no error code)',
        defaultMessage: 'Unexpected error'
    },
    profileBondAeth: {
        id: 'app.error.profileBondAeth',
        description: 'error message for bonding (manafying) AETH',
        defaultMessage: 'An error occured while manafying {amount} AETH'
    },
    profileCycleAeth: {
        id: 'app.error.profileCycleAeth',
        description: 'error message for cycling AETH',
        defaultMessage: 'An error occured while cycling {amount} AETH'
    },
    profileFreeAeth: {
        id: 'app.error.profileFreeAeth',
        description: 'error message for freeing AETH that was cycled',
        defaultMessage: 'An error occured while collecting your cycled AETH'
    },
    profileGetLocal: {
        id: 'app.error.profileGetLocal',
        description: 'error message for fetching local profiles',
        defaultMessage: 'An error occured while fetching local profiles'
    },
    profileGetList: {
        id: 'app.error.profileGetList',
        description: 'error message for fetching a list of profiles',
        defaultMessage: 'An error occured while getting the list of profiles'
    },
    profileToggleDonations: {
        id: 'app.error.profileToggleDonations',
        description: 'error message for changing the settings for accepting tips',
        defaultMessage: 'An error occured while changing your tips settings'
    },
    profileTransferAeth: {
        id: 'app.error.profileTransferAeth',
        description: 'error message for transferring AETH',
        defaultMessage: 'An error occured while transferring {tokenAmount} AETH'
    },
    profileTransferEth: {
        id: 'app.error.profileTransferEth',
        description: 'error message for transferring ETH',
        defaultMessage: 'An error occured while transferring {value} ETH'
    },
    profileTransformEssence: {
        id: 'app.error.profileTransformEssence',
        description: 'error message for transforming Essence in AETH',
        defaultMessage: 'An error occured while transforming {amount} Essence'
    },
    saveGeneralSettings: {
        id: 'app.error.saveGeneralSettings',
        description: 'error message for saving general settings',
        defaultMessage: 'An error occurred while saving your settings'
    },
});

export { errorMessages };
