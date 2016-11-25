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
        defaultMessage: 'Following {akashaId} ...'
    },
    followProfileSuccess: {
        id: 'app.notification.followProfileSuccess',
        description: 'Notification to be displayed when follow transaction was mined',
        defaultMessage: 'You are now following {akashaId}'
    },
    unfollowingProfile: {
        id: 'app.notification.unfollowingProfile',
        description: 'Notification to be displayed when unfollow transaction is sent',
        defaultMessage: 'Unfollowing {akashaId} ...'
    },
    unfollowProfileSuccess: {
        id: 'app.notification.unfollowProfileSuccess',
        description: 'Notification to be displayed when unfollow transaction was mined',
        defaultMessage: 'You are not following {akashaId} anymore'
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
    downvotingEntry: {
        id: 'app.notification.downvotingEntry',
        description: 'Notification to be displayed when entry downvote transaction is sent',
        defaultMessage: 'Downvoting {entryTitle} ...'
    },
    downvoteEntrySuccess: {
        id: 'app.notification.downvoteEntrySuccess',
        description: 'Notification to be displayed when downvote entry transaction was mined',
        defaultMessage: 'You successfully downvoted {entryTitle}'
    }
});
export { notificationMessages };
