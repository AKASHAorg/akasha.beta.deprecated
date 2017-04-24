import { defineMessages } from 'react-intl';

const dashboardMessages = defineMessages({
    columnLatest: {
        id: 'app.dashboard.columnLatest',
        description: 'title for "latest entries" column',
        defaultMessage: 'new on AKASHA'
    },
    columnStream: {
        id: 'app.dashboard.columnStream',
        description: 'title for "following stream" column',
        defaultMessage: 'followed users'
    }
});
export { dashboardMessages };
