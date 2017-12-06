import { defineMessages } from 'react-intl';

const highlightMessages = defineMessages({
    addYourNotes: {
        id: 'app.highlight.addYourNotes',
        description: 'placeholder for highlight notes textarea',
        defaultMessage: 'Add your notes here'
    },
    addNote: {
        id: 'app.highlight.addNote',
        description: 'label for add note button',
        defaultMessage: 'Add note'
    },
    delete: {
        id: 'app.highlight.delete',
        description: 'content for delete highlight modal',
        defaultMessage: 'Do you want to delete this highlight?'
    },
    deleteHighlight: {
        id: 'app.highlight.deleteHighlight',
        description: 'label for delete highlight button',
        defaultMessage: 'Delete highlight'
    },
    editNote: {
        id: 'app.highlight.editNote',
        description: 'label for edit note button',
        defaultMessage: 'Edit note'
    },
    startEntry: {
        id: 'app.highlight.startEntry',
        description: 'label for start an entry button',
        defaultMessage: 'Start an entry'
    }
});

export { highlightMessages };
