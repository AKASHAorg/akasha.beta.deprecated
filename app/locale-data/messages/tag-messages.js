import { defineMessages } from 'react-intl';

const tagMessages = defineMessages({
    addTag: {
        id: 'app.tag.addTag',
        description: 'placeholder for tag editor field',
        defaultMessage: '#category...'
    },
    recommendedTags: {
        id: 'app.tag.recommendedTags',
        description: 'tags recommended by Akasha',
        defaultMessage: 'Recommended tags'
    },
    subscribedTags: {
        id: 'app.tag.subscribedTags',
        description: 'tags that the user has subscribed',
        defaultMessage: 'Subscribed tags'
    },
    newestTags: {
        id: 'app.tag.newestTags',
        description: 'newest tags in the network',
        defaultMessage: 'Newest tags'
    },
    notEnoughKarma: {
        id: 'app.tag.notEnoughKarma',
        description: 'message to display when user does not have enough karma to do action',
        defaultMessage: 'Sorry! You don`t have enough karma to create tags.'
    },
    subscribe: {
        id: 'app.tag.subscribe',
        description: 'label for subscribe button',
        defaultMessage: 'Subscribe'
    },
    tagNotCreated: {
        id: 'app.tag.tagNotCreated',
        description: 'Message to display when the tag was not created before',
        defaultMessage: 'This is a new tag that wasn`t created by anyone before!'
    },
    unsubscribe: {
        id: 'app.tag.unsubscribe',
        description: 'label for unsubscribe button',
        defaultMessage: 'Unsubscribe'
    }
});
export { tagMessages };
