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
});
export { notificationMessages };
