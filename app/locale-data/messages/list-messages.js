import { defineMessages } from 'react-intl';

const listMessages = defineMessages({
    addToList: {
        id: 'app.list.addToList',
        description: 'tooltip for add to list button',
        defaultMessage: 'Add to list'
    },
    addToNewList: {
        id: 'app.list.addToNewList',
        description: 'title for new list form',
        defaultMessage: 'Add to a new list'
    },
    createNew: {
        id: 'app.list.createNew',
        description: 'create new list button label',
        defaultMessage: 'Create a new list'
    },
    descriptionPlaceholder: {
        id: 'app.list.descriptionPlaceholder',
        description: 'placeholder for list description input',
        defaultMessage: 'Add a short description'
    },
    deleteList: {
        id: 'app.list.deleteList',
        description: 'delete list confirmation text',
        defaultMessage: 'Are you sure you want to delete this list?'
    },
    editList: {
        id: 'app.list.editList',
        description: 'title for edit list popover',
        defaultMessage: 'Edit this list'
    },
    listName: {
        id: 'app.list.listName',
        description: 'label for list name input',
        defaultMessage: 'List name'
    },
    listNameRequired: {
        id: 'app.list.listNameRequired',
        description: 'error message for empty list name input',
        defaultMessage: 'List name is required'
    },
    listNameUnique: {
        id: 'app.list.listNameUnique',
        description: 'unique error message for list name input',
        defaultMessage: 'This list already exists'
    },
    namePlaceholder: {
        id: 'app.list.namePlaceholder',
        description: 'placeholder for list name input',
        defaultMessage: 'Type list name'
    },
    searchForList: {
        id: 'app.list.searchForList',
        description: 'placeholder for list search input',
        defaultMessage: 'Search for a list...'
    },
    shortDescription: {
        id: 'app.list.shortDescription',
        description: 'label for list description input',
        defaultMessage: 'Short description'
    },
});

export { listMessages };
