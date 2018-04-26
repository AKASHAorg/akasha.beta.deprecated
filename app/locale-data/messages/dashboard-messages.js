import { defineMessages } from 'react-intl';

const dashboardMessages = defineMessages({
    addColumn: {
        id: 'app.dashboard.addColumn',
        description: 'button label for adding a column to the board',
        defaultMessage: 'Add column'
    },
    addNewColumn: {
        id: 'app.dashboard.addNewColumn',
        description: 'panel title for adding a new column',
        defaultMessage: 'Add column'
    },
    addNewColumnSubtitle: {
        id: 'app.dashboard.addNewColumnSubtitle',
        description: 'panel subtitle for adding a new column',
        defaultMessage: 'Please select a column type'
    },
    addNewListColumn: {
        id: 'app.dashboard.addNewListColumn',
        description: 'panel title for adding a new list column',
        defaultMessage: 'List column'
    },
    addNewListColumnSubtitle: {
        id: 'app.dashboard.addNewListColumnSubtitle',
        description: 'panel subtitle for adding a new list column',
        defaultMessage: 'Please choose a list'
    },
    addNewProfileColumn: {
        id: 'app.dashboard.addNewProfileColumn',
        description: 'panel title for adding a new user column',
        defaultMessage: 'User column'
    },
    addNewProfileColumnSubtitle: {
        id: 'app.dashboard.addNewProfileColumnSubtitle',
        description: 'panel subtitle for adding a new user column',
        defaultMessage: 'Please choose a user'
    },
    addNewTagColumn: {
        id: 'app.dashboard.addNewTagColumn',
        description: 'panel title for adding a new tag column',
        defaultMessage: 'Tag column'
    },
    addNewTagColumnSubtitle: {
        id: 'app.dashboard.addNewTagColumnSubtitle',
        description: 'panel subtitle for adding a new tag column',
        defaultMessage: 'Please choose a tag'
    },
    addToBoard: {
        id: 'app.dashboard.addToBoard',
        description: 'button label for adding a tag/profile column to a board',
        defaultMessage: 'Add to board'
    },
    addToNewDashboard: {
        id: 'app.list.addToNewDashboard',
        description: 'popover title for creating a new dashboard',
        defaultMessage: 'Create a new board'
    },
    collection: {
        id: 'app.dashboard.collection',
        description: 'label for collection column',
        defaultMessage: 'Collection'
    },
    columnStream: {
        id: 'app.dashboard.columnStream',
        description: 'column title for "following feed" (entries published by the users that you are following)',
        defaultMessage: 'Following feed'
    },
    createDashboardFirst: {
        id: 'app.dashboard.createDashboardFirst',
        description: 'Tooltip message for add column button when there is no board created',
        defaultMessage: 'You must create a board first'
    },
    createOneNow: {
        id: 'app.dashboard.createOneNow',
        description: 'button label for creating a new board',
        defaultMessage: 'Create one now'
    },
    createNew: {
        id: 'app.dashboard.createNew',
        description: 'button label/tooltip for creating a new board',
        defaultMessage: 'Create a new board'
    },
    dashboardName: {
        id: 'app.dashboard.dashboardName',
        description: 'input label for board name field',
        defaultMessage: 'Board name'
    },
    dashboardNameRequired: {
        id: 'app.list.dashboardNameRequired',
        description: 'required error message for board name input field',
        defaultMessage: 'Board name is required'
    },
    dashboardNameUnique: {
        id: 'app.dashboard.dashboardNameUnique',
        description: 'unique name error message for board name input field',
        defaultMessage: 'This board already exists'
    },
    deleteColumnConfirmation: {
        id: 'app.dashboard.deleteColumnConfirmation',
        description: 'confirmation message for deleting a column',
        defaultMessage: 'Are you sure you want to delete this column?'
    },
    deleteDashboardConfirmation: {
        id: 'app.dashboard.deleteDashboardConfirmation',
        description: 'confirmation message for deleting a board',
        defaultMessage: 'Are you sure you want to delete {name}?'
    },
    firstDashboard: {
        id: 'app.dashboard.firstDashboard',
        description: 'the name for the first board',
        defaultMessage: 'My board'
    },
    large: {
        id: 'app.dashboard.large',
        description: 'large column width',
        defaultMessage: 'Large'
    },
    latest: {
        id: 'app.dashboard.latest',
        description: 'column title for "latest entries" (newest entries published on Akasha)',
        defaultMessage: 'Latest entries'
    },
    list: {
        id: 'app.dashboard.list',
        description: 'label for list column',
        defaultMessage: 'List'
    },
    listDeleted: {
        id: 'app.dashboard.listDeleted',
        description: 'message displayed when the list used in a list column was deleted',
        defaultMessage: 'This list was deleted. Please remove this column'
    },
    myBoards: {
        id: 'app.dashboard.myBoards',
        description: 'header for boards page secondary sidebar',
        defaultMessage: 'My boards'
    },
    namePlaceholder: {
        id: 'app.dashboard.namePlaceholder',
        description: 'placeholder for dashboard name input field',
        defaultMessage: 'Type board name'
    },
    noDashboards: {
        id: 'app.dashboard.noDashboard',
        description: 'placeholder message displayed when no boards were found',
        defaultMessage: 'No boards found'
    },
    previewList: {
        id: 'app.dashboard.previewList',
        description: 'label for list column preview',
        defaultMessage: 'Preview for {listName}'
    },
    previewProfile: {
        id: 'app.dashboard.previewProfile',
        description: 'label for user column preview',
        defaultMessage: 'Preview for {displayName}'
    },
    previewTag: {
        id: 'app.dashboard.previewTag',
        description: 'label for tag column preview',
        defaultMessage: 'Preview for #{tagName}'
    },
    profile: {
        id: 'app.dashboard.profile',
        description: 'label for user column',
        defaultMessage: 'User'
    },
    searchForBoard: {
        id: 'app.dashboard.searchForBoard',
        description: 'placeholder for board search input field',
        defaultMessage: 'Search for a board...'
    },
    small: {
        id: 'app.dashboard.small',
        description: 'small column width',
        defaultMessage: 'Small'
    },
    stream: {
        id: 'app.dashboard.stream',
        description: 'label for following feed column',
        defaultMessage: 'Following feed'
    },
    tag: {
        id: 'app.dashboard.tag',
        description: 'label for tag column',
        defaultMessage: 'Tag'
    },
    noColumnsTitle: {
        id: 'app.dashboard.noColumnsTitle',
        description: 'Column placeholder title',
        defaultMessage: 'A new world awaits you!'
    },
    noColumns: {
        id: 'app.dashboard.noColumns',
        description: 'Column placeholder message',
        defaultMessage: 'Your favorite topics and users at your fingertips.'
    },
    addFirstColumn: {
        id: 'app.dashboard.addFirstColumn',
        description: 'add first column button label',
        defaultMessage: 'Add first column'
    },
    createNewListColumnSubtitle: {
        id: 'app.dashboard.createNewListColumnSubtitle',
        description: 'panel subtitle for creating a new list and adding it to a column',
        defaultMessage: 'Please create a list'
    },
    akashaBoard: {
        id: 'app.dashboard.akashaBoard',
        description: 'label for dashboard top bar popover',
        defaultMessage: 'Akasha Board'
    },
    newBoard: {
        id: 'app.dashboard.newBoard',
        description: 'label for dashboard popover new board button',
        defaultMessage: 'New board'
    },
    createNewSubtitle: {
        id: 'app.dashboard.createNewSubtitle',
        description: 'subtitle for creating a new board modal',
        defaultMessage: 'Please insert the name of your board'
    },
    modalInputPlaceholder: {
        id: 'app.dashboard.modalInputPlaceholder',
        description: 'placeholder for new dashboard modal input',
        defaultMessage: 'Type the name of your board here'
    },
});
export { dashboardMessages };
