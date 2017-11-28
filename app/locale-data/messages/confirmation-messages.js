import { defineMessages } from 'react-intl';

const confirmationMessages = defineMessages({
    bondAeth: {
        id: 'app.confirmations.bondAeth',
        description: 'confirmation message for bond/manafy AETH',
        defaultMessage: 'Please confirm that you want to manafy {amount} AETH'
    },
    bondAethTitle: {
        id: 'app.confirmations.bondAethTitle',
        description: 'title for confirmation dialog for bond/manafy AETH',
        defaultMessage: 'Manafy'
    },
    claim: {
        id: 'app.confirmations.claim',
        description: 'confirmation message for collecting Essence from an entry',
        defaultMessage: 'Please confirm that you want to collect Essence.'
    },
    claimTitle: {
        id: 'app.confirmations.claimTitle',
        description: 'title for confirmation dialog for collecting Essence from an entry',
        defaultMessage: 'Collect'
    },
    claimVote: {
        id: 'app.confirmations.claimVote',
        description: 'confirmation message for collecting Essence from a vote',
        defaultMessage: 'Please confirm that you want to collect Essence.'
    },
    claimVoteTitle: {
        id: 'app.confirmations.claimVoteTitle',
        description: 'title for confirmation dialog for collecting Essence from a vote',
        defaultMessage: 'Collect'
    },
    comment: {
        id: 'app.confirmations.comment',
        description: 'confirmation message for publishing a comment',
        defaultMessage: 'Please confirm that you want to publish this comment.'
    },
    commentDownvote: {
        id: 'app.confirmations.commentDownvote',
        description: 'confirmation message for downvoting a comment',
        defaultMessage: 'Please confirm that you want to downvote this comment.'
    },
    commentDownvoteTitle: {
        id: 'app.confirmations.commentDownvoteTitle',
        description: 'title for confirmation dialog for downvoting a comment',
        defaultMessage: 'Downvote'
    },
    commentTitle: {
        id: 'app.confirmations.commentTitle',
        description: 'title for confirmation dialog for publishing comment',
        defaultMessage: 'Comment'
    },
    commentUpvote: {
        id: 'app.confirmations.commentUpvote',
        description: 'confirmation message for upvoting a comment',
        defaultMessage: 'Please confirm that you want to upvote this comment.'
    },
    commentUpvoteTitle: {
        id: 'app.confirmations.commentUpvoteTitle',
        description: 'title for confirmation dialog for upvoting a comment',
        defaultMessage: 'Upvote'
    },
    cycleAeth: {
        id: 'app.confirmations.cycleAeth',
        description: 'confirmation message for cycling AETH',
        defaultMessage: 'Please confirm that you want to cycle {amount} AETH'
    },
    cycleAethTitle: {
        id: 'app.confirmations.cycleAethTitle',
        description: 'title for confirmation dialog for cycling AETH',
        defaultMessage: 'Cycle'
    },
    draftPublish: {
        id: 'app.confirmations.draftPublish',
        description: 'confirmation for publishing a draft/entry',
        defaultMessage: 'Please confirm that you want to publish this draft.'
    },
    draftPublishTitle: {
        id: 'app.confirmations.draftPublishTitle',
        description: 'title for confirmation dialog for publishing a draft',
        defaultMessage: 'Publish draft'
    },
    draftPublishUpdate: {
        id: 'app.confirmations.draftPublishUpdate',
        description: 'confirmation message for updating an entry',
        defaultMessage: 'Please confirm that you want to update this entry.'
    },
    draftPublishUpdateTitle: {
        id: 'app.confirmations.draftPublishUpdateTitle',
        description: 'title for confirmation dialog for updating an entry',
        defaultMessage: 'Update entry',
    },
    entryDownvote: {
        id: 'app.confirmations.entryDownvote',
        description: 'confirmation message for downvoting an entry',
        defaultMessage: 'Please confirm that you want to downvote this entry.'
    },
    entryDownvoteTitle: {
        id: 'app.confirmations.entryDownvoteTitle',
        description: 'title for confirmation message for downvoting an entry',
        defaultMessage: 'Downvote'
    },
    entryUpvote: {
        id: 'app.confirmations.entryUpvote',
        description: 'confirmation message for upvoting an entry',
        defaultMessage: 'Please confirm that you want to upvote this entry.'
    },
    entryUpvoteTitle: {
        id: 'app.confirmations.entryUpvoteTitle',
        description: 'title for confirmation message for upvoting an entry',
        defaultMessage: 'Upvote'
    },
    follow: {
        id: 'app.confirmations.follow',
        description: 'confirmation message for following a user',
        defaultMessage: 'Please confirm that you want to follow {displayName}.'
    },
    followTitle: {
        id: 'app.confirmations.followTitle',
        description: 'title for confirmation dialog for following a user',
        defaultMessage: 'Follow'
    },
    freeAeth: {
        id: 'app.confirmations.freeAeth',
        description: 'confirmation message for freeing/collecting AETH',
        defaultMessage: 'Please confirm that you want to collect your cycled AETH'
    },
    freeAethTitle: {
        id: 'app.confirmations.freeAethTitle',
        description: 'title for confirmation dialog for freeing/collecting AETH',
        defaultMessage: 'Collect'
    },
    passphrase: {
        id: 'app.confirmations.passphrase',
        description: 'request passphrase for reauthentication if login token has expired',
        defaultMessage: 'Please insert your passphrase to proceed with the process.'
    },
    profileRegister: {
        id: 'app.confirmations.profileRegister',
        description: 'confirmation message for registering a profile',
        defaultMessage: 'Please confirm that you want to register your profile.'
    },
    profileRegisterTitle: {
        id: 'app.confirmations.profileRegisterTitle',
        description: 'title for confirmation dialog for registering a profile',
        defaultMessage: 'Register profile'
    },
    profileUpdate: {
        id: 'app.confirmations.profileUpdate',
        description: 'confirmation message for updating your profile',
        defaultMessage: 'Please confirm that you want to update your profile.'
    },
    profileUpdateTitle: {
        id: 'app.confirmations.profileUpdateTitle',
        description: 'title for confirmation dialog for updating your profile',
        defaultMessage: 'Update profile'
    },
    sendTip: {
        id: 'app.confirmations.sendTip',
        description: 'confirmation message for sending a tip',
        defaultMessage: 'Please confirm that you want to send a tip of {value} ETH to {displayName}.'
    },
    sendTipTitle: {
        id: 'app.confirmations.sendTipTitle',
        description: 'title for confirmation dialog for sending a tip',
        defaultMessage: 'Send tip'
    },
    tagCreate: {
        id: 'app.confirmations.createTag',
        description: 'confirmation message for creating a tag',
        defaultMessage: 'Please confirm that you want to create #{value}.'
    },
    tagCreateTitle: {
        id: 'app.confirmations.tagCreateTitle',
        description: 'title for confirmation dialog for creating a tag',
        defaultMessage: 'Create tag'
    },
    toggleDonations: {
        id: 'app.confirmation.toggleDonations',
        description: 'confirmation message for changing your settings for accepting tips',
        defaultMessage: 'Please confirm that you want to change your tips settings.'
    },
    toggleDonationsTitle: {
        id: 'app.confirmation.toggleDonationsTitle',
        description: 'title for confirmation dialog for changing your settings for accepting tips',
        defaultMessage: 'Change tips settings'
    },
    transferAeth: {
        id: 'app.confirmation.transferAeth',
        description: 'confirmation message for transfering AETH',
        defaultMessage: 'Please confirm that you want to transfer {tokenAmount} AETH to {displayName}.'
    },
    transferAethTitle: {
        id: 'app.confirmation.transferAethTitle',
        description: 'title for confirmation dialog for transfering AETH',
        defaultMessage: 'Transfer AETH'
    },
    transferEth: {
        id: 'app.confirmation.transferEth',
        description: 'confirmation message for transfering ETH',
        defaultMessage: 'Please confirm that you want to transfer {value} ETH to {displayName}.'
    },
    transferEthTitle: {
        id: 'app.confirmation.transferEthTitle',
        description: 'title for confirmation dialog for transfering ETH',
        defaultMessage: 'Transfer ETH'
    },
    transformEssence: {
        id: 'app.confirmations.transformEssence',
        description: 'confirmation message for transforming Essence into AETH',
        defaultMessage: 'Please confirm that you want to transform {amount} Essence'
    },
    transformEssenceTitle: {
        id: 'app.confirmations.transformEssenceTitle',
        description: 'title for confirmation diialog for transforming Essence into AETH',
        defaultMessage: 'Transform Essence'
    },
    unfollow: {
        id: 'app.confirmations.unfollow',
        description: 'confirmation message for unfollowing a user',
        defaultMessage: 'Please confirm that you want to unfollow {displayName}.'
    },
    unfollowTitle: {
        id: 'app.confirmations.unfollowTitle',
        description: 'title for confirmation dialog for unfollowing a user',
        defaultMessage: 'Unfollow'
    },
});
export { confirmationMessages };
