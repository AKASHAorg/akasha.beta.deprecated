import { defineMessages } from 'react-intl';

const entryMessages = defineMessages({
    allowedImageTypes: {
        id: 'app.entry.allowedImageTypes',
        description: 'types of images allowed for upload',
        defaultMessage: 'JPG, GIF or PNG images'
    },
    alreadyDownvoted: {
        id: 'app.entry.alreadyDownvoted',
        description: 'tooltip for vote buttons when the entry/comment was already downvoted',
        defaultMessage: 'You downvoted with weight {weight}'
    },
    alreadyUpvoted: {
        id: 'app.entry.alreadyUpvoted',
        description: 'tooltip for vote buttons when the entry/comment was already upvoted',
        defaultMessage: 'You upvoted with weight {weight}'
    },
    articleEntryType: {
        id: 'app.entry.articleEntryType',
        description: 'entry of type article',
        defaultMessage: 'Article entries'
    },
    cannotClaimEntry: {
        id: 'app.entry.cannotClaimEntry',
        description: 'tooltip for collect button for the situation when a user cannot collect Essence for his entry',
        defaultMessage: 'You can only collect Essence if your entry\'s score is positive'
    },
    cannotClaimVote: {
        id: 'app.entry.cannotClaimVote',
        description: 'tooltip for collect button for the situation when a user cannot collect Essence for his vote',
        defaultMessage: 'You can only collect Essence if your vote is aligned with the majority (e.g. you upvoted and entry score is positive)'
    },
    collected: {
        id: 'app.entry.collected',
        description: 'Essence was collected for an entry/vote',
        defaultMessage: 'Essence collected'
    },
    collectEssence: {
        id: 'app.entry.collectEssence',
        description: 'collect essence from a published entry or vote',
        defaultMessage: 'Collect Essence'
    },
    commentsCount: {
        id: 'app.entry.commentsCount',
        description: 'Number of comments',
        defaultMessage: `{count, number} {count, plural,
            one {comment}
            few {comments}
            many {comments}
            other {comments}
        }`
    },
    continueEditing: {
        id: 'app.entry.continueEditing',
        description: 'label for continue editing button',
        defaultMessage: 'Continue editing'
    },
    downvote: {
        id: 'app.entry.downvote',
        description: 'downvote button tooltip',
        defaultMessage: 'Downvote'
    },
    draft: {
        id: 'app.entry.draft',
        description: 'a draft is an entry that wasn\'t published yet (the data is only kept locally)',
        defaultMessage: 'Draft'
    },
    drafts: {
        id: 'app.entry.drafts',
        description: 'drafts section title',
        defaultMessage: 'Drafts'
    },
    draftsCount: {
        id: 'app.entry.draftsCount',
        description: 'number of drafts',
        defaultMessage: `{count, number} {count, plural,
            one {draft}
            few {drafts}
            many {drafts}
            other {drafts}
        }`
    },
    draftContentRequired: {
        id: 'app.entry.draftContentRequired',
        description: 'validation message for entry with no content',
        defaultMessage: 'You can\'t create an article without content!'
    },
    draftDelete: {
        id: 'app.entry.draftDelete',
        description: 'delete draft button label',
        defaultMessage: 'Delete draft',
    },
    draftEdit: {
        id: 'app.entry.draftEdit',
        description: 'edit draft button label',
        defaultMessage: 'Edit draft'
    },
    draftSaved: {
        id: 'app.entry.draftSaved',
        description: 'draft saved status message',
        defaultMessage: 'Draft saved'
    },
    draftSaving: {
        id: 'app.entry.draftSaving',
        description: 'saving draft status message',
        defaultMessage: 'Saving draft'
    },
    draftSharePreview: {
        id: 'app.entry.draftSharePreview',
        description: 'share preview link button label',
        defaultMessage: 'Share preview link',
    },
    edited: {
        id: 'app.entry.edited',
        description: 'edited label for an entry',
        defaultMessage: 'Edited'
    },
    editEntry: {
        id: 'app.entry.editEntry',
        description: 'tooltip for Edit entry button',
        defaultMessage: 'Edit entry'
    },
    entriesCount: {
        id: 'app.entry.entriesCount',
        description: 'number of entries',
        defaultMessage: `{count, number} {count, plural,
            one {entry}
            other {entries}
        }`
    },
    errorOneTagRequired: {
        id: 'app.entry.oneTagRequired',
        description: 'Error message requiring at least one tag',
        defaultMessage: 'You must add at least one tag'
    },
    errorExcerptTooLong: {
        id: 'app.entry.errorExcerptTooLong',
        description: 'Error message shown when excerpt is too long',
        defaultMessage: 'Excerpt must not be longer than 120 characters'
    },
    excerpt: {
        id: 'app.entry.excerpt',
        description: 'excerpts section title',
        defaultMessage: 'excerpt'
    },
    featuredImage: {
        id: 'app.entry.featuredImage',
        description: 'featured image section title',
        defaultMessage: 'Featured image'
    },
    license: {
        id: 'app.entry.license',
        description: 'License label',
        defaultMessage: 'License'
    },
    linkEntryType: {
        id: 'app.entry.linkEntryType',
        description: 'entry of type link',
        defaultMessage: 'Link entries'
    },
    loadMoreReplies: {
        id: 'app.entry.loadMoreReplies',
        description: 'label for load more replies button',
        defaultMessage: 'Load more replies'
    },
    localVersion: {
        id: 'app.entry.localVersion',
        description: 'label for local version of an entry',
        defaultMessage: 'Local version'
    },
    newComments: {
        id: 'app.entry.newComments',
        description: 'Message to show when new comments were published',
        defaultMessage: `{count, number} new {count, plural,
            one {comment}
            few {comments}
            many {comments}
            other {comments}
        }`
    },
    noCommentsFound: {
        id: 'app.entry.noCommentsFound',
        description: 'placeholder for empty comments list',
        defaultMessage: 'No comments found'
    },
    noEntries: {
        id: 'app.entry.noEntries',
        description: 'placeholder for empty entry list',
        defaultMessage: 'No entries'
    },
    noNewEntries: {
        id: 'app.entry.noNewEntries',
        description: 'placeholder for empty latest entries list',
        defaultMessage: 'No new entries'
    },
    noVotes: {
        id: 'app.entry.noVotes',
        description: 'Placeholder for empty votes list',
        defaultMessage: 'No votes'
    },
    olderVersion: {
        id: 'app.entry.olderVersion',
        description: 'entry subtitle for reading older versions',
        defaultMessage: 'You are now viewing an older'
    },
    originalVersion: {
        id: 'app.entry.originalVersion',
        description: 'label for original version',
        defaultMessage: 'Original'
    },
    publicDiscussion: {
        id: 'app.entry.publicDiscussion',
        description: 'entry comments section title',
        defaultMessage: 'Public discussion'
    },
    published: {
        id: 'app.entry.published',
        description: 'published entry',
        defaultMessage: 'Published'
    },
    publishOptions: {
        id: 'app.entry.publishOptions',
        description: 'publish options panel title',
        defaultMessage: 'Publish options'
    },
    readTime: {
        id: 'app.entry.readTime',
        description: 'estimated time to read an entry (e.g. 10 min read)',
        defaultMessage: 'read'
    },
    revertConfirmTitle: {
        id: 'app.entry.revertConfirmTitle',
        description: 'confirmation message when reverting a draft',
        defaultMessage: 'Are you sure you want to revert this draft?'
    },
    saveHighlight: {
        id: 'app.entry.saveHighlight',
        description: 'save highlight button label',
        defaultMessage: 'Save highlight'
    },
    score: {
        id: 'app.entry.score',
        description: 'entry score',
        defaultMessage: 'Score'
    },
    searchProfile: {
        id: 'app.entry.searchProfile',
        description: 'placeholder for profile column',
        defaultMessage: 'Search for a profile'
    },
    searchTag: {
        id: 'app.entry.searchTag',
        description: 'placeholder for tag column',
        defaultMessage: 'Search for a tag'
    },
    showLess: {
        id: 'app.entry.showLess',
        description: 'label for comment collapse button',
        defaultMessage: 'Collapse comment'
    },
    showMore: {
        id: 'app.entry.showMore',
        description: 'label for comment expand button',
        defaultMessage: 'Show full comment'
    },
    startComment: {
        id: 'app.entry.startComment',
        description: 'button label for starting a comment from a highlight',
        defaultMessage: 'Start comment'
    },
    titleRequired: {
        id: 'app.entry.titleRequired',
        description: 'validation message in case of missing title field',
        defaultMessage: 'Title must not be empty'
    },
    upvote: {
        id: 'app.entry.upvote',
        description: 'upvote button tooltip',
        defaultMessage: 'Upvote'
    },
    version: {
        id: 'app.entry.version',
        description: 'entry version',
        defaultMessage: 'version'
    },
    versionHistory: {
        id: 'app.entry.versionHistory',
        description: 'version history dialog title',
        defaultMessage: 'Version history'
    },
    versionNumber: {
        id: 'app.entry.versionNumber',
        description: 'label for version number',
        defaultMessage: 'Version {index}'
    },
    votePending: {
        id: 'app.entry.votePending',
        description: 'tooltip for vote button in pending state (waiting for vote transaction to be mined)',
        defaultMessage: 'Your vote is pending'
    },
    votePercentage: {
        id: 'app.entry.votePercentage',
        description: 'vote percentage distribution between downvotes and upvotes',
        defaultMessage: 'Upvotes - {upvote}% · Downvotes - {downvote}%'
    },
    votingOwnComment: {
        id: 'app.entry.votingOwnComment',
        description: 'tooltip for vote button for your own comment',
        defaultMessage: 'You cannot vote your own comment'
    },
    votingPeriod: {
        id: 'app.entry.votingPeriod',
        description: 'voting period for an entry has ended',
        defaultMessage: 'The voting period has ended'
    },
    votingPeriodDisclaimer: {
        id: 'app.entry.votingPeriodDisclaimer',
        description: 'disclaimer message for votes when voting period has ended',
        defaultMessage: 'Users can still vote on the entry but the mana burned for these votes can\'t be collected by the author or the voters.'
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
    writeComment: {
        id: 'app.entry.writeComment',
        description: 'input placeholder for writing a comment',
        defaultMessage: 'Write a comment'
    },
    writeReplyTo: {
        id: 'app.entry.writeReplyTo',
        description: 'placeholder for writing a reply to someone {name}',
        defaultMessage: 'Write a reply to {name}'
    },
});
export { entryMessages };
