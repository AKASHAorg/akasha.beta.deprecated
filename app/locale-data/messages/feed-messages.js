import { defineMessages } from 'react-intl';

const feedMessages = defineMessages({
    deleteNotification: {
        id: 'app.feed.deleteNotification',
        description: 'tooltip for delete notification button',
        defaultMessage: 'Delete notification'
    },
    enableNotification: {
        id: 'app.feed.enableNotification',
        description: 'tooltip for enable notifications for a specific user',
        defaultMessage: 'Enable notifications from this user'
    },
    disableNotification: {
        id: 'app.feed.disableNotification',
        description: 'tooltip for disable notifications for a specific user',
        defaultMessage: 'Disable notifications from this user'
    }
});
export { feedMessages };
