import { defineMessages } from 'react-intl';

const chatMessages = defineMessages({
    joinedChannels: {
        id: 'app.chat.joinedChannels',
        description: 'header for joined channels list',
        defaultMessage: 'Starred channels'
    },
    recentChannels: {
        id: 'app.chat.recentChannels',
        description: 'header for recent channels list',
        defaultMessage: 'Channels'
    },
    joinChannel: {
        id: 'app.chat.joinChannel',
        description: 'title for join channel dialog',
        defaultMessage: 'Join channel'
    },
    channelName: {
        id: 'app.chat.channelName',
        description: 'label for channel input field',
        defaultMessage: 'Channel name'
    },
    inputPlaceholder: {
        id: 'app.chat.inputPlaceholder',
        description: 'placeholder for chat input',
        defaultMessage: 'Write something nice and press \"Enter\" to send it'
    },
    emptyChannelInputError: {
        id: 'app.chat.emptyChannelInputError',
        description: 'error message displayed when the channel input field is empty',
        defaultMessage: 'Channel name should not be empty'
    },
    startWithAlphanumericError: {
        id: 'app.chat.startWithAlphanumericError',
        description: 'error message displayed when the channel name does not begin with alphanumeric character',
        defaultMessage: 'Channel name must begin with lowercase alphanumeric character'
    },
    illegalCharactersFormat: {
        id: 'app.chat.illegalCharactersFormat',
        description: 'error message displayed when the channel name does not respect the requested format',
        defaultMessage: 'Only lowercase alphanumeric characters, dashes (-) and underscores (_) allowed'
    },
    channelTooLongError: {
        id: 'app.chat.channelTooLongError',
        description: 'error message displayed when the channel name is too long',
        defaultMessage: 'Channel name must not have more than 32 characters'
    }
});

export { chatMessages };
