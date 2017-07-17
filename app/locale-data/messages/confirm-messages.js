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
    generalConfirmationTitle: {
        id: 'app.confirm.generalConfirmationTitle',
        description: 'default message in case of missing confirmation title',
        defaultMessage: 'Action requires confirmation'
    },
    generalConfirmation: {
        id: 'app.confirm.generalConfirmation',
        description: 'default message in case of missing confirmation description',
        defaultMessage: 'An action you made needs your confirmation!'
    },
    inactiveEntryError: {
        id: 'app.confirm.inactiveEntryError',
        description: 'error message to be displayed when an entry is no longer active',
        defaultMessage: 'The voting period for this entry has ended'
    },
    tag_register_title: {
        id: 'app.confirm.publishTagTitle',
        description: 'confirm dialog title for publishing a tag',
        defaultMessage: 'Confirm tag publishing'
    },
    tag_register: {
        id: 'app.confirm.publishTag',
        description: 'confirm dialog message for publishing a tag',
        defaultMessage: 'Are you sure you want to publish tag "{tagName}"?'
    },
    tag_subscribe_title: {
        id: 'app.confirm.subscribeTagTitle',
        description: 'confirm dialog title for subscribing to a tag',
        defaultMessage: 'Confirm tag subscription'
    },
    tag_subscribe: {
        id: 'app.confirm.subscribeTag',
        description: 'confirm dialog message for subscribing to a tag',
        defaultMessage: 'Are you sure you want to subscribe to tag "{tagName}"?'
    },
    tag_unsubscribe_title: {
        id: 'app.confirm.unsubscribeTagTitle',
        description: 'confirm dialog title for unsubscribing from a tag',
        defaultMessage: 'Confirm tag unsubscription'
    },
    tag_unsubscribe: {
        id: 'app.confirm.unsubscribeTag',
        description: 'confirm dialog message for unsubscribing from a tag',
        defaultMessage: 'Are you sure you want to unsubscribe from tag "{tagName}"?'
    },
    profile_follow_title: {
        id: 'app.confirm.followProfileTitle',
        description: 'confirm dialog title for following a profile',
        defaultMessage: 'Confirm follow profile'
    },
    profile_follow: {
        id: 'app.confirm.followProfile',
        description: 'confirm dialog message for following a profile',
        defaultMessage: 'Are you sure you want to follow "@{akashaId}"?'
    },
    profile_unfollow_title: {
        id: 'app.confirm.unfollowProfileTitle',
        description: 'confirm dialog title for unfollowing a profile',
        defaultMessage: 'Confirm unfollow profile'
    },
    profile_unfollow: {
        id: 'app.confirm.unfollowProfile',
        description: 'confirm dialog message for unfollowing a profile',
        defaultMessage: 'Are you sure you want to unfollow "@{akashaId}"?'
    },
    tempProfile_update_title: {
        id: 'app.confirm.updateProfileTitle',
        description: 'confirm dialog title for updating your profile',
        defaultMessage: 'Confirm profile update'
    },
    tempProfile_update: {
        id: 'app.confirm.updateProfile',
        description: 'confirm dialog message for updating your profile',
        defaultMessage: 'Are you sure you want to update your profile?'
    },
    entry_publish_title: {
        id: 'app.confirm.publishEntryTitle',
        description: 'confirm dialog title for entry publishing',
        defaultMessage: 'Publish entry'
    },
    entry_publish: {
        id: 'app.confirm.publishEntry',
        description: 'confirm dialog message for entry publishing',
        defaultMessage: 'Are you sure you want to publish "{title}"?'
    },
    entryVersion_publish_title: {
        id: 'app.confirm.publishNewEntryVersionTitle',
        description: 'confirm dialog title for publishing new entry version',
        defaultMessage: 'Update entry'
    },
    entryVersion_publish: {
        id: 'app.confirm.publishNewEntryVersion',
        description: 'confirm dialog message for publishing new entry version',
        defaultMessage: 'Are you sure you want to update "{title}"?'
    },
    upvoteWeightDisclaimer: {
        id: 'app.confirm.upvoteWeightDisclaimer',
        description: 'disclaimer for choosing an entry upvote weight',
        defaultMessage: '@{publisherAkashaId} will receive {eth} AETH from your +{voteWeight} vote'
    },
    downvoteWeightDisclaimer: {
        id: 'app.confirm.downvoteWeightDisclaimer',
        description: 'disclaimer for choosing an entry downvote weight',
        defaultMessage: '{eth} AETH will go to the faucet from your {voteWeight} vote'
    },
    voteWeightDisclaimer: {
        id: 'app.confirm.voteWeightDisclaimer',
        description: 'disclaimer for vote weight input field',
        defaultMessage: 'Bigger weight means bigger impact, but also more costs for you.'
    },
    voteFeeAgreement: {
        id: 'app.confirm.feeAgreement',
        description: 'disclaimer for the cost of the vote',
        defaultMessage: `By proceeding to vote this entry, you agree with the {fee} AETH fee,
                meaning a total of {total} AETH excluding gas cost
                which will be deducted from your {balance} AETH balance.`
    },
    upvote_title: {
        id: 'app.confirm.upvoteTitle',
        description: 'confirm dialog title for voting an entry',
        defaultMessage: 'Upvote'
    },
    downvote_title: {
        id: 'app.confirm.downvoteTitle',
        description: 'confirm dialog title for voting an entry',
        defaultMessage: 'Downvote'
    },
    comment_publish_title: {
        id: 'app.confirm.publishCommentTitle',
        description: 'confirm dialog title for publishing new comment',
        defaultMessage: 'Comment'
    },
    comment_publish: {
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
    },
    sendTipTitle: {
        id: 'app.confirm.sendTipTitle',
        description: 'confirm dialog title for sending a tip to someone',
        defaultMessage: 'Send tip'
    },
    sendTip: {
        id: 'app.confirm.sendTip',
        description: 'confirm dialog message for sending a tip to someone',
        defaultMessage: 'Are you sure you want to blabla?'
    },
    ethAmountLabel: {
        id: 'app.confirm.ethAmount',
        description: 'eth amount input label',
        defaultMessage: 'AETH amount'
    },
    maxEthAmountLabel: {
        id: 'app.confirm.maxEthAmount',
        description: 'max eth amount label',
        defaultMessage: 'max. {balance}'
    },
    receiverLabel: {
        id: 'app.confirm.receiverLabel',
        description: 'receiver input label',
        defaultMessage: 'Send AETH to'
    }
});
export { confirmMessages };
