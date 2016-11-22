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
    }
});
export { confirmMessages };
