import { defineMessages } from 'react-intl';

// messages used for describing transactions depending on the action type
export const actionMessages = defineMessages({
    bondAeth: {
        id: 'app.action.bondAeth',
        description: 'bond/manafy AETH',
        defaultMessage: 'Manafy {amount} AETH'
    },
    claim: {
        id: 'app.action.claim',
        description: 'claim/collect Essence from entry',
        defaultMessage: 'Collect Essence for'
    },
    claimVote: {
        id: 'app.action.claimVote',
        description: 'claim/collect Essence from vote on entry',
        defaultMessage: 'Collect Essence for vote on'
    },
    comment: {
        id: 'app.action.comment',
        description: 'publish comment on an entry',
        defaultMessage: 'Comment on'
    },
    commentDownvote: {
        id: 'app.action.commentDownvote',
        description: 'downvote comment on an entry',
        defaultMessage: 'Downvote comment on'
    },
    commentUpvote: {
        id: 'app.action.commentUpvote',
        description: 'upvote comment on an entry',
        defaultMessage: 'Upvote comment on'
    },
    cycleAeth: {
        id: 'app.action.cycleAeth',
        description: 'cycle manafied AETH',
        defaultMessage: 'Cycle {amount} AETH'
    },
    draftPublish: {
        id: 'app.action.draftPublish',
        description: 'publish an entry',
        defaultMessage: 'Publish'
    },
    draftPublishUpdate: {
        id: 'app.action.draftPublishUpdate',
        description: 'update/edit an entry',
        defaultMessage: 'Update'
    },
    entryDownvote: {
        id: 'app.action.entryDownvote',
        description: 'downvote an entry',
        defaultMessage: 'Downvote {weight} on'
    },
    entryUpvote: {
        id: 'app.action.entryUpvote',
        description: 'upvote an entry',
        defaultMessage: 'Upvote {weight} on'
    },
    faucet: {
        id: 'app.action.faucet',
        description: 'make faucet request for funds',
        defaultMessage: 'Request funds from faucet'
    },
    follow: {
        id: 'app.action.follow',
        description: 'follow a profile',
        defaultMessage: 'Follow'
    },
    freeAeth: {
        id: 'app.action.freeAeth',
        description: 'collect/free cycled AETH',
        defaultMessage: 'Collect {amount} Cycled AETH'
    },
    profileRegister: {
        id: 'app.action.profileRegister',
        description: 'register your profile',
        defaultMessage: 'Register your profile'
    },
    profileUpdate: {
        id: 'app.action.profileUpdate',
        description: 'update your profile',
        defaultMessage: 'Update your profile'
    },
    sendTip: {
        id: 'app.action.sendTip',
        description: 'send tip to someone',
        defaultMessage: 'Send tip to'
    },
    toggleDonations: {
        id: 'app.action.toggleDonations',
        description: 'change tip options (from personal settings)',
        defaultMessage: 'Change tip options'
    },
    transferAeth: {
        id: 'app.action.transferAeth',
        description: 'transfer AETH to someone',
        defaultMessage: 'Transfer {tokenAmount} AETH to'
    },
    transferEth: {
        id: 'app.action.transferEth',
        description: 'transfer ETH to someone',
        defaultMessage: 'Transfer {value} ETH to'
    },
    transformEssence: {
        id: 'app.action.transformEssence',
        description: 'transform Essence into new AETH (forge AETH)',
        defaultMessage: 'Transform {amount} Essence'
    },
    unfollow: {
        id: 'app.action.unfollow',
        description: 'unfollow a profile',
        defaultMessage: 'Unfollow'
    }
});
