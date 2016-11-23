import { defineMessages } from 'react-intl';

const notificationMessages = defineMessages({
    updatingProfile: {
        id: 'app.notification.updatingProfile',
        description: 'Notification to be displayed when update profile transaction is sent',
        defaultMessage: 'Your profile is updating...'
    },
    profileUpdateSuccess: {
        id: 'app.notification.profileUpdateSuccess',
        description: 'Notification to be displayed when update profile transaction was mined',
        defaultMessage: 'Your profile was successfully updated'
    },
    following: {
        id: 'app.notification.following',
        description: 'Notification to be displayed when following transaction is sent',
        defaultMessage: 'Follow request was sent'
    },
    followProfileSuccess: {
        id: 'app.notification.followProfileSuccess',
        description: 'Notification to be displayed when following transaction was mined',
        defaultMessage: 'Follow request was successfull'
    },
    tagPublishedSuccessfully: {
        id: 'app.notification.tagPublishedSuccessfully',
        description: 'Notification to be displayed when a tag was published',
        defaultMessage: 'Tag {tagName} published successfully'
    },
    subscribingTag: {
        id: 'app.notification.subscribingTag',
        description: 'Notification to be displayed when subscribe tag transaction is sent',
        defaultMessage: 'Subscribing to \"{tagName}\"'
    },
    tagSubscribedSuccessfully: {
        id: 'app.notification.tagSubscribedSuccessfully',
        description: 'Notification to be displayed when a user subscribed to a tag',
        defaultMessage: 'You successfully subscribed to tag \"{tagName}\"'
    },
    unsubscribingTag: {
        id: 'app.notification.unsubscribingTag',
        description: 'Notification to be displayed when unsubscribe tag transaction is sent',
        defaultMessage: 'Unsubscribing from \"{tagName}\"'
    },
    tagUnsubscribedSuccessfully: {
        id: 'app.notification.tagUnsubscribedSuccessfully',
        description: 'Notification to be displayed when a user unsubscribed from a tag',
        defaultMessage: 'You successfully unsubscribed from tag \"{tagName}\"'
    }
});
export { notificationMessages };
