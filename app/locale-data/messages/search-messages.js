import { defineMessages } from 'react-intl';

const searchMessages = defineMessages({
    connectingToService: {
        id: 'app.search.connectingToService',
        description: 'message to display when trying to connect to search service',
        defaultMessage: 'Connecting to search service...'
    },
    noResults: {
        id: 'app.search.noResults',
        description: 'message displayed when no results are found',
        defaultMessage: 'No results found'
    },
    searchSomething: {
        id: 'app.search.searchSomething',
        description: 'placeholder for search input',
        defaultMessage: 'Search something...'
    },
    serviceError: {
        id: 'app.search.serviceError',
        description: 'Error message to display when search service is not available',
        defaultMessage: 'Search service is not available at the moment. Please try again later.'
    },
    tryToReconnect: {
        id: 'app.search.tryToReconnect',
        description: 'error message to display 3 consecutive query errors',
        defaultMessage: 'You may have been disconnected from the search service. Try to reconnect.'
    }
});
export { searchMessages };
