import { defineMessages } from 'react-intl';

const confirmMessages = defineMessages({
    gasInputLabel: {
        id: 'app.confirm.gasInputLabel',
        description: 'label for gas amount input',
        defaultMessage: 'Maximum amount of gas to use'
    },
    gasInputDisclaimer: {
        id: 'app.confirm.gasInputDisclaimer',
        description: 'disclaimer for gas amount input',
        defaultMessage: 'Gas to be used by this transaction. Unused gas will be returned.'
    },
    inactiveEntryError: {
        id: 'app.confirm.inactiveEntryError',
        description: 'error message to be displayed when an entry is no longer active',
        defaultMessage: 'The voting period for this entry has ended'
    },
    registerTagTitle: {
        id: 'app.confirm.publishTagTitle',
        description: 'confirm dialog title for publishing a tag',
        defaultMessage: 'Confirm tag publishing'
    },
    registerTag: {
        id: 'app.confirm.publishTag',
        description: 'confirm dialog message for publishing a tag',
        defaultMessage: 'Are you sure you want to publish tag "{tagName}"?'
    },
    subscribeTagTitle: {
        id: 'app.confirm.subscribeTagTitle',
        description: 'confirm dialog title for subscribing to a tag',
        defaultMessage: 'Confirm tag subscription'
    },
    subscribeTag: {
        id: 'app.confirm.subscribeTag',
        description: 'confirm dialog message for subscribing to a tag',
        defaultMessage: 'Are you sure you want to subscribe to tag "{tagName}"?'
    },
    unsubscribeTagTitle: {
        id: 'app.confirm.unsubscribeTagTitle',
        description: 'confirm dialog title for unsubscribing from a tag',
        defaultMessage: 'Confirm tag unsubscription'
    },
    unsubscribeTag: {
        id: 'app.confirm.unsubscribeTag',
        description: 'confirm dialog message for unsubscribing from a tag',
        defaultMessage: 'Are you sure you want to unsubscribe from tag "{tagName}"?'
    },
    followProfileTitle: {
        id: 'app.confirm.followProfileTitle',
        description: 'confirm dialog title for following a profile',
        defaultMessage: 'Confirm follow profile'
    },
    followProfile: {
        id: 'app.confirm.followProfile',
        description: 'confirm dialog message for following a profile',
        defaultMessage: 'Are you sure you want to follow "{akashaId}"?'
    },
    unfollowProfileTitle: {
        id: 'app.confirm.unfollowProfileTitle',
        description: 'confirm dialog title for unfollowing a profile',
        defaultMessage: 'Confirm unfollow profile'
    },
    unfollowProfile: {
        id: 'app.confirm.unfollowProfile',
        description: 'confirm dialog message for unfollowing a profile',
        defaultMessage: 'Are you sure you want to unfollow "{akashaId}"?'
    },
    updateProfileTitle: {
        id: 'app.confirm.updateProfileTitle',
        description: 'confirm dialog title for updating your profile',
        defaultMessage: 'Confirm profile update'
    },
    updateProfile: {
        id: 'app.confirm.updateProfile',
        description: 'confirm dialog message for updating your profile',
        defaultMessage: 'Are you sure you want to update your profile?'
    },
    publishEntryTitle: {
        id: 'app.confirm.publishEntryTitle',
        description: 'confirm dialog title for entry publishing',
        defaultMessage: 'Publish entry'
    },
    publishEntry: {
        id: 'app.confirm.publishEntry',
        description: 'confirm dialog message for entry publishing',
        defaultMessage: 'Are you sure you want to publish "{title}"?'
    },
    upvoteWeightDisclaimer: {
        id: 'app.confirm.upvoteWeightDisclaimer',
        description: 'disclaimer for choosing an entry upvote weight',
        defaultMessage: '{publisherName} will receive {eth} ETH from your +{voteWeight} vote'
    },
    downvoteWeightDisclaimer: {
        id: 'app.confirm.downvoteWeightDisclaimer',
        description: 'disclaimer for choosing an entry downvote weight',
        defaultMessage: '{eth} ETH will go to the faucet from your {voteWeight} vote'
    },
    voteFeeAgreement: {
        id: 'app.confirm.feeAgreement',
        description: 'disclaimer for the cost of the vote',
        defaultMessage: `By proceeding to vote this entry, you agree with the {fee} ETH fee,
                meaning a total of {total} ETH excluding gas cost
                which will be deducted from your {balance} ETH balance.`
    },
    voteTitle: {
        id: 'app.confirm.voteTitle',
        description: 'confirm dialog title for voting an entry',
        defaultMessage: 'Vote'
    },
    publishCommentTitle: {
        id: 'app.confirm.publishCommentTitle',
        description: 'confirm dialog title for publishing new comment',
        defaultMessage: 'Comment'
    },
    publishComment: {
        id: 'app.confirm.publishComment',
        description: 'confirm dialog message for new comment publishing',
        defaultMessage: 'Are you sure you want to comment?'
    },
    claimTitle: {
        id: 'app.confirm.claimTitle',
        description: 'confirm dialog title for claiming an entry\'s balance',
        defaultMessage: 'Claim'
    },
    claim: {
        id: 'app.confirm.claim',
        description: 'confirm dialog message for claiming an entry\'s balance',
        defaultMessage: `Are you sure you want to claim this entry\'s balance?
                {entryTitle}`
    }
});
export { confirmMessages };
