import { defineMessages } from 'react-intl';

const confirmMessages = defineMessages({
    publishTagTitle: {
        id: 'app.confirm.publishTagTitle',
        description: 'confirm dialog title for publishing a tag',
        defaultMessage: 'Confirm tag publishing'
    },
    publishTag: {
        id: 'app.confirm.publishTag',
        description: 'confirm dialog message for publishing a tag',
        defaultMessage: 'Are you sure you want to publish tag \"{tagName}\"?'
    },
    subscribeTagTitle: {
        id: 'app.confirm.subscribeTagTitle',
        description: 'confirm dialog title for subscribing to a tag',
        defaultMessage: 'Confirm tag subscription'
    },
    subscribeTag: {
        id: 'app.confirm.subscribeTag',
        description: 'confirm dialog message for subscribing to a tag',
        defaultMessage: 'Are you sure you want to subscribe to tag \"{tagName}\"?'
    },
    unsubscribeTagTitle: {
        id: 'app.confirm.unsubscribeTagTitle',
        description: 'confirm dialog title for unsubscribing from a tag',
        defaultMessage: 'Confirm tag unsubscription'
    },
    unsubscribeTag: {
        id: 'app.confirm.unsubscribeTag',
        description: 'confirm dialog message for unsubscribing from a tag',
        defaultMessage: 'Are you sure you want to unsubscribe from tag \"{tagName}\"?'
    },
    followProfileTitle: {
        id: 'app.confirm.followProfileTitle',
        description: 'confirm dialog title for following a profile',
        defaultMessage: 'Confirm follow profile'
    },
    followProfile: {
        id: 'app.confirm.followProfile',
        description: 'confirm dialog message for following a profile',
        defaultMessage: 'Are you sure you want to follow \"{akashaId}\"?'
    },
    unfollowProfileTitle: {
        id: 'app.confirm.unfollowProfileTitle',
        description: 'confirm dialog title for unfollowing a profile',
        defaultMessage: 'Confirm unfollow profile'
    },
    unfollowProfile: {
        id: 'app.confirm.unfollowProfile',
        description: 'confirm dialog message for unfollowing a profile',
        defaultMessage: 'Are you sure you want to unfollow \"{akashaId}\"?'
    }
});
export { confirmMessages };
