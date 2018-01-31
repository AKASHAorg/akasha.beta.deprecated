import { defineMessages } from 'react-intl';

const tagMessages = defineMessages({
    addTag: {
        id: 'app.tag.addTag',
        description: 'placeholder for tag editor field',
        defaultMessage: '#category...'
    },
    notEnoughKarma: {
        id: 'app.tag.notEnoughKarma',
        description: 'message to display when user does not have enough karma to create a tag',
        defaultMessage: 'Sorry! You don\'t have enough karma to create tags.'
    },
    tagDoesntExist: {
        id: 'app.tag.tagDoesntExist',
        description: 'placeholder message for entry list when tag does not exist',
        defaultMessage: 'This tag doesn\'t exist'
    },
    tagNotCreated: {
        id: 'app.tag.tagNotCreated',
        description: 'Message to display when the tag was not created before',
        defaultMessage: 'This is a new tag that wasn`t created by anyone before!'
    },
    tagsLeft: {
        id: 'app.tag.tagsLeft',
        description: 'How many tags you can add',
        defaultMessage: '({value} remaining)'
    },
    tags: {
        id: 'app.tag.tags',
        description: 'plural of tag',
        defaultMessage: 'tags'
    },
});

export { tagMessages };
