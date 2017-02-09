import { defineMessages } from 'react-intl';

const searchMessages = defineMessages({
    connectingToService: {
        id: 'app.search.connectingToService',
        description: 'message to display when trying to connect to search service',
        defaultMessage: 'Connecting to search service...'
    },
    serviceError: {
        id: 'app.search.serviceError',
        description: 'Error message to display when search service is not available',
        defaultMessage: 'Search service is not available at the moment. Please try again later.'
    },
    queryLengthError: {
        id: 'app.search.queryLengthError',
        description: 'error message to display when query is longer than allowed',
        defaultMessage: 'The query must have maximum 32 characters'
    },
    tryToReconnect: {
        id: 'app.search.tryToReconnect',
        description: 'error message to display 3 consecutive query errors',
        defaultMessage: 'You may have been disconnected from the search service. Try to reconnect.'
    }
});
export { searchMessages };
