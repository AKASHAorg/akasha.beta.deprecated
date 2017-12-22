import { defineMessages } from 'react-intl';

const notificationMessages = defineMessages({
    bondAethSuccess: {
        id: 'app.notification.bondAethSuccess',
        description: 'notification to be displayed when bond/manafy AETH transaction was mined',
        defaultMessage: 'You successfully manafied {amount} AETH'
    },
    cycleAethSuccess: {
        id: 'app.notification.cycleAethSuccess',
        description: 'notification to be displayed when unlock/cycle AETH transaction was mined',
        defaultMessage: 'You successfully cycled {amount} AETH'
    },
    freeAethSuccess: {
        id: 'app.notification.freeAethSuccess',
        description: 'notification to be displayed when collecting cycled AETH transaction was mined',
        defaultMessage: 'You successfully collected your cycled AETH'
    },
    highlightSaveSuccess: {
        id: 'app.notification.highlightSaveSuccess',
        description: 'Notification to be displayed when a highlight has been saved',
        defaultMessage: 'The highlight has been saved!'
    },
    highlightSaveSuccessInputPlaceholder: {
        id: 'app.notification.highlightSaveSuccessInputPlaceholder',
        description: 'Placeholder for note input after highlight save',
        defaultMessage: 'Do you want to type a note?'
    },
    updatingProfile: {
        id: 'app.notification.updatingProfile',
        description: 'Notification to be displayed when update profile transaction is sent',
        defaultMessage: 'Your profile is updating ...'
    },
    updateProfileSuccess: {
        id: 'app.notification.updateProfileSuccess',
        description: 'Notification to be displayed when update profile transaction was mined',
        defaultMessage: 'Your profile was successfully updated'
    },
    followingProfile: {
        id: 'app.notification.followingProfile',
        description: 'Notification to be displayed when follow transaction is sent',
        defaultMessage: 'Following {displayName} ...'
    },
    followProfileSuccess: {
        id: 'app.notification.followProfileSuccess',
        description: 'Notification to be displayed when follow transaction was mined',
        defaultMessage: 'You are now following {displayName}'
    },
    transformEssenceSuccess: {
        id: 'app.notification.transformEssenceSuccess',
        description: 'notification to be displayed when transform Essence transaction was mined',
        defaultMessage: 'You successfully transformed {amount} Essence'
    },
    unfollowingProfile: {
        id: 'app.notification.unfollowingProfile',
        description: 'Notification to be displayed when unfollow transaction is sent',
        defaultMessage: 'Unfollowing {displayName} ...'
    },
    unfollowProfileSuccess: {
        id: 'app.notification.unfollowProfileSuccess',
        description: 'Notification to be displayed when unfollow transaction was mined',
        defaultMessage: 'You are not following {displayName} anymore'
    },
    registerProfileSuccess: {
        id: 'app.notification.registerProfileSuccess',
        description: 'Notification to be displayed when register profile transaction was mined',
        defaultMessage: 'Highfives! Profile successfully registered!'
    },
    publishCommentSuccess: {
        id: 'app.notification.publishCommentSuccess',
        description: 'Notification to be displayed when publish comment transaction was mined',
        defaultMessage: 'You successfully published a comment'
    },
    publishingEntry: {
        id: 'app.notification.publishingEntry',
        description: 'Notification for when entry is publishing',
        defaultMessage: 'Publishing "{title}".'
    },
    publishingNewEntryVersion: {
        id: 'app.notification.publishingNewEntryVersion',
        description: 'Notification for when a new entry version is publishing',
        defaultMessage: 'Updating "{title}".'
    },
    newVersionPublishedSuccessfully: {
        id: 'app.notification.newVersionPublishedSuccessfully',
        description: 'Notification for when a new version was published',
        defaultMessage: 'Entry updated successfully'
    },
    draftPublishedSuccessfully: {
        id: 'app.notification.draftPublishedSuccessfully',
        description: 'Notification for when draft successfully registered/published',
        defaultMessage: 'Entry published successfully'
    },
    claimSuccess: {
        id: 'app.notification.claimSuccess',
        description: 'Notification to be displayed when collect Essence transaction was mined',
        defaultMessage: 'You successfully collected Essence for {entryTitle}'
    },
    claimVoteSuccess: {
        id: 'app.notification.claimVoteSuccess',
        description: 'Notification to be displayed when collect Essence for vote transaction was mined',
        defaultMessage: 'You successfully collected Essence for {entryTitle}'
    },
    downvotingEntry: {
        id: 'app.notification.downvotingEntry',
        description: 'Notification to be displayed when entry downvote transaction is sent',
        defaultMessage: 'Downvoting {entryTitle} ...'
    },
    downvoteCommentSuccess: {
        id: 'app.notification.downvoteCommentSuccess',
        description: 'Notification to be displayed when downvote comment transaction was mined',
        defaultMessage: 'You successfully downvoted a comment'
    },
    downvoteEntrySuccess: {
        id: 'app.notification.downvoteEntrySuccess',
        description: 'Notification to be displayed when downvote entry transaction was mined',
        defaultMessage: 'You successfully downvoted {entryTitle}'
    },
    upvotingEntry: {
        id: 'app.notification.upvotingEntry',
        description: 'Notification to be displayed when entry upvote transaction is sent',
        defaultMessage: 'Upvoting {entryTitle} ...'
    },
    upvoteCommentSuccess: {
        id: 'app.notification.upvoteCommentSuccess',
        description: 'Notification to be displayed when upvote comment transaction was mined',
        defaultMessage: 'You successfully upvoted a comment'
    },
    upvoteEntrySuccess: {
        id: 'app.notification.upvoteEntrySuccess',
        description: 'Notification to be displayed when upvote entry transaction was mined',
        defaultMessage: 'You successfully upvoted {entryTitle}'
    },
    publishingComment: {
        id: 'app.notification.publishingComment',
        description: 'Notification to be displayed when comment publishing tx was sent',
        defaultMessage: 'Publishing comment'
    },
    commentPublishedSuccessfully: {
        id: 'app.notification.commentPublishedSuccessfully',
        description: 'Notification to be displayed when comment successfully published',
        defaultMessage: 'Comment published successfully'
    },
    claiming: {
        id: 'app.notification.claiming',
        description: 'Notification to be displayed when collect transaction is sent',
        defaultMessage: 'Collecting Essence for {entryTitle} ...'
    },
    draftSavedSuccessfully: {
        id: 'app.notification.draftSavedSuccessfully',
        description: 'notification to show when draft was successfully saved',
        defaultMessage: 'Draft successfully saved!'
    },
    draftDeletedSuccessfully: {
        id: 'app.notification.draftDeletedSuccessfully',
        description: 'notification to show when draft was successfully deleted',
        defaultMessage: 'Draft successfully deleted!'
    },
    linkCopiedToClipboard: {
        id: 'app.notification.linkCopiedToClipboard',
        description: 'notification to show when user copies profile link',
        defaultMessage: 'Link copied to clipboard'
    },
    sendingTip: {
        id: 'app.notification.sendingTip',
        description: 'Notification to be displayed when tip transaction is sent',
        defaultMessage: 'Sending tip to {displayName} ...'
    },
    sendTipSuccess: {
        id: 'app.notification.sendTipSuccess',
        description: 'Notification to be displayed when tip transaction was successfully mined',
        defaultMessage: 'You have successfully tipped {displayName}'
    },
    notificationsEnabledSuccess: {
        id: 'app.notification.notificationsEnabledSuccess',
        description: 'message to be displayed when notifications were enabled for a specific user',
        defaultMessage: 'Notifications enabled for {displayName}'
    },
    notificationsDisabledSuccess: {
        id: 'app.notification.notificationsDisabledSuccess',
        description: 'message to be displayed when notifications were disabled for a specific user',
        defaultMessage: 'Notifications disabled for {displayName}'
    },
    backupSuccess: {
        id: 'app.notification.backupSuccess',
        description: 'message to display when the keystore backup was generated successfully',
        defaultMessage: 'Backup was generated at {path}'
    },
    saveGethSettingsSuccess: {
        id: 'app.notification.saveGethSettingsSuccess',
        description: 'Geth settings successfully saved',
        defaultMessage: `You have successfully saved your settings. You need to restart the geth
                        service for your changes to be applied.`
    },
    saveIpfsSettingsSuccess: {
        id: 'app.notification.saveIpfsSettingsSuccess',
        description: 'IPFS settings successfully saved',
        defaultMessage: `You have successfully saved your settings. You need to restart the IPFS
                        service for your changes to be applied.`
    },
    setIpfsPortsSuccess: {
        id: 'app.notification.setIpfsPortsSuccess',
        description: 'IPFS ports successfully set',
        defaultMessage: `You have successfully set the IPFS ports. You need to restart the IPFS
                        service for your changes to be applied.`
    },
    themeTips: {
        id: 'app.settings.themeTips',
        description: 'theme tips',
        defaultMessage: 'Your theme will change after refreshing the app.'
    },
    toggleDonationsSuccess: {
        id: 'app.notification.toggleDonationsSuccess',
        description: 'toggle accepting donations/tips transaction was succesfully mined',
        defaultMessage: 'You succesfully changed your tips settings'
    },
    transferAethSuccess: {
        id: 'app.notification.transferAethSuccess',
        description: 'transfer AETH transaction was successfully mined',
        defaultMessage: 'You successfully transfered {tokenAmount} AETH to {displayName}'
    },
    transferEthSuccess: {
        id: 'app.notification.transferEthSuccess',
        description: 'transfer ETH transaction was successfully mined',
        defaultMessage: 'You successfully transfered {value} ETH to {displayName}'
    },
    userSettingsSaveSuccess: {
        id: 'app.notification.userSettingsSaveSuccess',
        description: 'User settings successfully saved',
        defaultMessage: 'You have successfully saved your personal settings'
    },
});
export { notificationMessages };
