import { defineMessages } from 'react-intl';

const entryMessages = defineMessages({
    draft: {
        id: 'app.entry.draft',
        description: 'draft label indicator',
        defaultMessage: 'Draft'
    },
    draftCardSubtitle: {
        id: 'app.entry.draftCardSubtitle',
        description: 'subtitle showing last updated time and words number on draft card in new entry panel',
        defaultMessage: '{lastUpdate} - {wordCount} words so far'
    },
    publishedBlockDiff: {
        id: 'app.entry.publishedBlockDiff',
        description: 'how many blocks ago was an entry published',
        defaultMessage: `Published {blockDiff, number} {blockDiff, plural,
                one {block}
                few {blocks}
                many {blocks}
                other {blocks}
            } ago`
    },
    minutesCount: {
        id: 'app.entry.minutesCount',
        description: 'minutes of read time',
        defaultMessage: '{minutes, number} min'
    },
    hoursCount: {
        id: 'app.entry.hoursCount',
        description: 'hours of read time',
        defaultMessage: `{hours, number} {hours, plural,
                one {hour}
                few {hours}
                many {hours}
                other {hours}
            }`
    },
    wordsCount: {
        id: 'app.entry.wordsCount',
        description: 'number of words in an entry',
        defaultMessage: `{words, number} {words, plural,
                one {word}
                few {words}
                many {words}
                other {words}
            }`
    },
    readTime: {
        id: 'app.entry.readTime',
        description: 'estimated time to read an entry',
        defaultMessage: 'read'
    },
    allComments: {
        id: 'app.entry.allComments',
        description: 'all comments section title',
        defaultMessage: 'ALL COMMENTS ({commentsCount})'
    },
    writeComment: {
        id: 'app.entry.writeComment',
        description: 'placeholder for writing a comment',
        defaultMessage: 'Write a comment'
    }
});
export { entryMessages };
