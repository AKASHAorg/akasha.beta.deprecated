import { defineMessages } from 'react-intl';

const searchMessages = defineMessages({
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
});
export { searchMessages };
