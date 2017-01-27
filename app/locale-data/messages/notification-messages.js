import { defineMessages } from 'react-intl';

const notificationMessages = defineMessages({
    updatingProfile: {
        id: 'app.notification.updatingProfile',
        description: 'Notification to be displayed when update profile transaction is sent',
        defaultMessage: 'Your profile is updating ...'
    },
    profileUpdateSuccess: {
        id: 'app.notification.profileUpdateSuccess',
        description: 'Notification to be displayed when update profile transaction was mined',
        defaultMessage: 'Your profile was successfully updated'
    },
    followingProfile: {
        id: 'app.notification.followingProfile',
        description: 'Notification to be displayed when follow transaction is sent',
        defaultMessage: 'Following @{akashaId} ...'
    },
    followProfileSuccess: {
        id: 'app.notification.followProfileSuccess',
        description: 'Notification to be displayed when follow transaction was mined',
        defaultMessage: 'You are now following @{akashaId}'
    },
    unfollowingProfile: {
        id: 'app.notification.unfollowingProfile',
        description: 'Notification to be displayed when unfollow transaction is sent',
        defaultMessage: 'Unfollowing @{akashaId} ...'
    },
    unfollowProfileSuccess: {
        id: 'app.notification.unfollowProfileSuccess',
        description: 'Notification to be displayed when unfollow transaction was mined',
        defaultMessage: 'You are not following @{akashaId} anymore'
    },
    registeringTag: {
        id: 'app.notification.registeringTag',
        description: 'Notification snackbar to display when a tag is registering',
        defaultMessage: 'Registering "{tagName}" tag.'
    },
    tagRegisteredSuccessfully: {
        id: 'app.notification.tagRegisteredSuccessfully',
        description: 'Notification to be displayed when a tag was registered',
        defaultMessage: 'Tag "{tagName}" successfully registered.'
    },
    subscribingTag: {
        id: 'app.notification.subscribingTag',
        description: 'Notification to be displayed when subscribe tag transaction is sent',
        defaultMessage: 'Subscribing to "{tagName}" ...'
    },
    tagSubscribedSuccessfully: {
        id: 'app.notification.tagSubscribedSuccessfully',
        description: 'Notification to be displayed when a user subscribed to a tag',
        defaultMessage: 'You successfully subscribed to tag "{tagName}"'
    },
    unsubscribingTag: {
        id: 'app.notification.unsubscribingTag',
        description: 'Notification to be displayed when unsubscribe tag transaction is sent',
        defaultMessage: 'Unsubscribing from "{tagName}" ...'
    },
    tagUnsubscribedSuccessfully: {
        id: 'app.notification.tagUnsubscribedSuccessfully',
        description: 'Notification to be displayed when a user unsubscribed from a tag',
        defaultMessage: 'You successfully unsubscribed from tag "{tagName}"'
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
    upvotingEntry: {
        id: 'app.notification.upvotingEntry',
        description: 'Notification to be displayed when entry upvote transaction is sent',
        defaultMessage: 'Upvoting {entryTitle} ...'
    },
    upvoteEntrySuccess: {
        id: 'app.notification.upvoteEntrySuccess',
        description: 'Notification to be displayed when upvote entry transaction was mined',
        defaultMessage: 'You successfully upvoted {entryTitle}'
    },
    upvoteEntryError: {
        id: 'app.notification.upvoteEntryError',
        description: 'Notification to be displayed when upvote entry transaction was mined but was unsuccessfull',
        defaultMessage: 'Upvoting {entryTitle} has failed'
    },
    downvotingEntry: {
        id: 'app.notification.downvotingEntry',
        description: 'Notification to be displayed when entry downvote transaction is sent',
        defaultMessage: 'Downvoting {entryTitle} ...'
    },
    downvoteEntrySuccess: {
        id: 'app.notification.downvoteEntrySuccess',
        description: 'Notification to be displayed when downvote entry transaction was mined',
        defaultMessage: 'You successfully downvoted {entryTitle}'
    },
    downvoteEntryError: {
        id: 'app.notification.downvoteEntryError',
        description: 'Notification to be displayed when downvote entry transaction was mined but was unsuccessfull',
        defaultMessage: 'Downvoting {entryTitle} has failed'
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
        description: 'Notification to be displayed when claim transaction is sent',
        defaultMessage: 'Claiming {entryTitle} ...'
    },
    claimSuccess: {
        id: 'app.notification.claimSuccess',
        description: 'Notification to be displayed when claim transaction was mined',
        defaultMessage: 'You successfully claimed {entryTitle}'
    },
    claimError: {
        id: 'app.notification.claimError',
        description: 'Notification to be displayed when claim transaction was mined but was unsuccessfull',
        defaultMessage: 'Claiming {entryTitle} has failed'
    },
    draftSavedSuccessfully: {
        id: 'app.notification.draftSavedSuccessfully',
        description: 'notification to show when draft was successfully saved',
        defaultMessage: 'Draft successfully saved!'
    },
    draftSaveFailed: {
        id: 'app.notification.draftSaveFailed',
        description: 'Notification to show when saving draft failed',
        defaultMessage: 'Failed to save draft!'
    },
    draftDeletedSuccessfully: {
        id: 'app.notification.draftDeletedSuccessfully',
        description: 'notification to show when draft was successfully deleted',
        defaultMessage: 'Draft successfully deleted!'
    },
    draftDeleteFailed: {
        id: 'app.notification.draftDeleteFailed',
        description: 'Notification to show when deleting draft failed',
        defaultMessage: 'Failed to delete draft!'
    },
    editorMessage: {
        id: 'app.notification.editorMessage',
        description: 'just a placeholder',
        defaultMessage: '{errorMessage}'
    },
    linkCopiedToClipboard: {
        id: 'app.notification.linkCopiedToClipboard',
        description: 'notification to show when user copies profile link',
        defaultMessage: 'Link copied to clipboard'
    },
    sendingTip: {
        id: 'app.notification.sendingTip',
        description: 'Notification to be displayed when tip transaction is sent',
        defaultMessage: 'Sending tip to @{akashaId} ...'
    },
    sendTipSuccess: {
        id: 'app.notification.sendTipSuccess',
        description: 'Notification to be displayed when tip transaction was successfully mined',
        defaultMessage: 'You have successfully tipped @{akashaId}'
    },
    sendTipError: {
        id: 'app.notification.sendTipError',
        description: 'Notification to be displayed when tip transaction was mined but was unsuccessfull',
        defaultMessage: 'Tipping @{akashaId} has failed'
    },
    notificationsEnabledSuccess: {
        id: 'app.notification.notificationsEnabledSuccess',
        description: 'message to be displayed when notifications were enabled for a specific user',
        defaultMessage: 'Notifications enabled for @{akashaId}'
    },
    notificationsEnabledError: {
        id: 'app.notification.notificationsEnabledError',
        description: 'message to be displayed when enabling notifications for a specific user has failed',
        defaultMessage: 'Enabling notifications for @{akashaId} has failed'
    },
    notificationsDisabledSuccess: {
        id: 'app.notification.notificationsDisabledSuccess',
        description: 'message to be displayed when notifications were disabled for a specific user',
        defaultMessage: 'Notifications disabled for @{akashaId}'
    },
    notificationsDisabledError: {
        id: 'app.notification.notificationsDisabledError',
        description: 'message to be displayed when disabling notifications for a specific user has failed',
        defaultMessage: 'Disabling notifications for @{akashaId} has failed'
    },
    channelStarred: {
        id: 'app.notification.channelStarred',
        description: 'message to be displayed when a chat channel was starred',
        defaultMessage: '#{channel} was starred'
    }
});
export { notificationMessages };
