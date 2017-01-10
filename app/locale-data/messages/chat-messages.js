import { defineMessages } from 'react-intl';

const chatMessages = defineMessages({
    recommendedChannels: {
        id: 'app.chat.recommendedChannels',
        description: 'chat channels recommended by Akasha',
        defaultMessage: 'Available Whisper channel'
    },
    inputPlaceholder: {
        id: 'app.chat.inputPlaceholder',
        description: 'placeholder for chat input',
        defaultMessage: 'Write something nice and press \"Enter\" to send it'
    }
});

export { chatMessages };
