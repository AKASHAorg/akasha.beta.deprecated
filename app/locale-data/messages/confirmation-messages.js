import { defineMessages } from 'react-intl';

const confirmationMessages = defineMessages({
    claim: {
        id: 'app.confirmations.claim',
        description: 'confirmation message for claim',
        defaultMessage: 'Please confirm that you want to claim these funds.'
    },
    comment: {
        id: 'app.confirmations.comment',
        description: 'confirmation message for comment',
        defaultMessage: 'Please confirm that you want to submit this comment.'
    },
    createTag: {
        id: 'app.confirmations.createTag',
        description: 'confirmation message for createTag',
        defaultMessage: 'Please confirm that you want to create this tag: {value}.'
    },
    downvote: {
        id: 'app.confirmations.downvote',
        description: 'confirmation message for downvote',
        defaultMessage: 'Please confirm that you want to downvote.'
    },
    follow: {
        id: 'app.confirmations.follow',
        description: 'confirmation message for follow',
        defaultMessage: 'Please confirm that you want to follow @{akashaId}.'
    },
    passphrase: {
        id: 'app.confirmations.passphrase',
        description: 'request passphrase',
        defaultMessage: 'Please insert your passphrase to proceed with the process.'
    },
    profileRegister: {
        id: 'app.confirmations.profileRegister',
        description: 'confirmation message for profileRegister',
        defaultMessage: 'Please confirm that you want to register.'
    },
    profileUpdate: {
        id: 'app.confirmations.profileUpdate',
        description: 'confirmation message for updating profile',
        defaultMessage: 'Please confirm that you want to update your profile.'
    },
    sendTip: {
        id: 'app.confirmations.sendTip',
        description: 'confirmation message for sendTip',
        defaultMessage: 'Please confirm that you want to send a tip of {value} AETH to @{akashaId}.'
    },
    unfollow: {
        id: 'app.confirmations.unfollow',
        description: 'confirmation message for unfollow',
        defaultMessage: 'Please confirm that you want to unfollow @{akashaId}.'
    },
    upvote: {
        id: 'app.confirmations.upvote',
        description: 'confirmation message for upvote',
        defaultMessage: 'Please confirm that you want to upvote.'
    },
    claimTitle: {
        id: 'app.confirmations.claimTitle',
        description: 'title for confirmation message for claim',
        defaultMessage: 'Claim'
    },
    commentTitle: {
        id: 'app.confirmations.commentTitle',
        description: 'title for confirmation message for comment',
        defaultMessage: 'Comment'
    },
    createTagTitle: {
        id: 'app.confirmations.createTagTitle',
        description: 'title for confirmation message for createTag',
        defaultMessage: 'Create Tag'
    },
    downvoteTitle: {
        id: 'app.confirmations.downvoteTitle',
        description: 'title for confirmation message for downvote',
        defaultMessage: 'Downvote'
    },
    followTitle: {
        id: 'app.confirmations.followTitle',
        description: 'title for confirmation message for follow',
        defaultMessage: 'Follow'
    },
    profileRegisterTitle: {
        id: 'app.confirmations.profileRegisterTitle',
        description: 'title for confirmation message for profileRegister',
        defaultMessage: 'Register Profile'
    },
    profileUpdateTitle: {
        id: 'app.confirmations.profileUpdateTitle',
        description: 'title for confirmation message for updating profile',
        defaultMessage: 'Update Profile'
    },
    sendTipTitle: {
        id: 'app.confirmations.sendTipTitle',
        description: 'title for confirmation message for sendTip',
        defaultMessage: 'Send Tip'
    },
    unfollowTitle: {
        id: 'app.confirmations.unfollowTitle',
        description: 'title for confirmation message for unfollow',
        defaultMessage: 'Unfollow'
    },
    upvoteTitle: {
        id: 'app.confirmations.upvoteTitle',
        description: 'title for confirmation message for upvote',
        defaultMessage: 'Upvote'
    }
});
export { confirmationMessages };
