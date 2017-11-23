import { defineMessages } from 'react-intl';

const entryMessages = defineMessages({
    alreadyClaimed: {
        id: 'app.entry.alreadyClaimed',
        description: 'claim button tooltip when it was already claimed',
        defaultMessage: 'Already claimed'
    },
    allowedImageTypes: {
        id: 'app.entry.allowedImageTypes',
        description: 'types of images allowed',
        defaultMessage: 'JPG, GIF or PNG images'
    },
    articleEntryType: {
        id: 'app.entry.articleEntryType',
        description: 'entry of type article',
        defaultMessage: 'Article Entries'
    },
    linkEntryType: {
        id: 'app.entry.linkEntryType',
        description: 'entry of type link',
        defaultMessage: 'Link Entries'
    },
    alreadyDownvoted: {
        id: 'app.entry.alreadyDownvoted',
        description: 'vote button tooltip when it was already downvoted',
        defaultMessage: 'You downvoted with weight {weight}'
    },
    alreadyUpvoted: {
        id: 'app.entry.alreadyUpvoted',
        description: 'vote button tooltip when it was already upvoted',
        defaultMessage: 'You upvoted with weight {weight}'
    },
    blockNr: {
        id: 'app.entry.blockNr',
        description: 'block number',
        defaultMessage: 'Block {blockNr}'
    },
    cannotClaimEntry: {
        id: 'app.entry.cannotClaimEntry',
        description: 'disclaimer for the situation when you cannot claim an entry',
        defaultMessage: 'You can only collect Essence if your entry\'s score is positive'
    },
    cannotClaimVote: {
        id: 'app.entry.cannotClaimVote',
        description: 'disclaimer for the situation when you cannot claim a vote',
        defaultMessage: 'You can only collect Essence if your vote is aligned with the majority (e.g. you upvoted and entry score is positive)'
    },
    claim: {
        id: 'app.entry.claim',
        description: 'claim button tooltip',
        defaultMessage: 'Claim'
    },
    collected: {
        id: 'app.entry.collected',
        description: 'Essence was collected',
        defaultMessage: 'Essence collected'
    },
    collectEssence: {
        id: 'app.entry.collectEssence',
        description: 'collect essence from published entry or vote',
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
    downvote: {
        id: 'app.entry.downvote',
        description: 'downvote button tooltip',
        defaultMessage: 'Downvote'
    },
    draft: {
        id: 'app.entry.draft',
        description: 'draft label indicator',
        defaultMessage: 'Draft'
    },
    drafts: {
        id: 'app.entry.drafts',
        description: 'drafts section title',
        defaultMessage: 'Drafts'
    },
    draftsCount: {
        id: 'app.entry.draftsCount',
        description: 'drafts count',
        defaultMessage: `{count, number} {count, plural,
            one {draft}
            few {drafts}
            many {drafts}
            other {drafts}
        }`
    },
    draftCardSubtitle: {
        id: 'app.entry.draftCardSubtitle',
        description: 'subtitle showing last updated time and words number on draft card in new entry panel',
        defaultMessage: '{lastUpdate} - {wordCount} words so far'
    },
    draftContentRequired: {
        id: 'app.entry.draftContentRequired',
        description: 'validation message for no entry content',
        defaultMessage: 'Cannot create an article without content!'
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
        defaultMessage: 'Draft Saved'
    },
    draftSaving: {
        id: 'app.entry.draftSaving',
        description: 'saving draft status message',
        defaultMessage: 'Saving Draft'
    },
    draftSharePreview: {
        id: 'app.entry.draftSharePreview',
        description: 'share preview link button title',
        defaultMessage: 'Share preview link',
    },
    entriesCount: {
        id: 'app.entry.entriesCount',
        description: 'counting entries',
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
    excerptTooLong: {
        id: 'app.entry.excerptTooLong',
        description: 'validation message when excerpt is too long',
        defaultMessage: 'Excerpt must not be longer than 120 characters'
    },
    featuredImage: {
        id: 'app.entry.featuredImage',
        description: 'featured image section title',
        defaultMessage: 'Featured Image'
    },
    findingDraft: {
        id: 'app.entry.findingDraft',
        description: 'status text when finding draft',
        defaultMessage: 'Finding draft'
    },
    license: {
        id: 'app.entry.license',
        description: 'License label',
        defaultMessage: 'License'
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
    publicDiscussion: {
        id: 'app.entry.publicDiscussion',
        description: 'entry comments section title',
        defaultMessage: 'Public discussion'
    },
    published: {
        id: 'app.entry.published',
        description: 'published',
        defaultMessage: 'Published'
    },
    publishOptions: {
        id: 'app.entry.publishOptions',
        description: 'publish options panel title',
        defaultMessage: 'Publish Options'
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
    searchSomething: {
        id: 'app.entry.searchSomething',
        description: 'placeholder for draft search input',
        defaultMessage: 'Search something...'
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
    tagsRequired: {
        id: 'app.entry.tagsRequired',
        description: 'validation message for no tags added',
        defaultMessage: 'You must add at least 1 tag'
    },
    titleRequired: {
        id: 'app.entry.titleRequired',
        description: 'validation message in case of missing title field',
        defaultMessage: 'Title must not be empty'
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
    writeComment: {
        id: 'app.entry.writeComment',
        description: 'placeholder for writing a comment',
        defaultMessage: 'Write a comment'
    },
    writeReplyTo: {
        id: 'app.entry.writeReplyTo',
        description: 'placeholder for writing a reply to someone {name}',
        defaultMessage: 'Write a reply to {name}'
    },
    loadingComments: {
        id: 'app.entry.loadingComments',
        description: 'message when loading comments for the first time',
        defaultMessage: 'Loading comments'
    },
    loadMoreReplies: {
        id: 'app.entry.loadMoreReplies',
        description: 'label for load more replies button',
        defaultMessage: 'Load more replies'
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
    votePercentage: {
        id: 'app.entry.votePercentage',
        description: '',
        defaultMessage: 'Upvotes - {upvote}% · Downvotes - {downvote}%'
    },
    originalVersion: {
        id: 'app.entry.originalVersion',
        description: 'label for original version',
        defaultMessage: 'Original'
    },
    localVersion: {
        id: 'app.entry.localVersion',
        description: 'label for local version',
        defaultMessage: 'Local version'
    },
    continueEditing: {
        id: 'app.entry.continueEditing',
        description: 'label for continue editing button',
        defaultMessage: 'Continue editing'
    },
    editEntry: {
        id: 'app.entry.editEntry',
        description: 'tooltip for Edit entry button',
        defaultMessage: 'Edit entry'
    },
    excerpt: {
        id: 'app.entry.excerpt',
        description: 'excerpts section title',
        defaultMessage: 'excerpt'
    },
    cannotEdit: {
        id: 'app.entry.cannotEdit',
        description: 'tooltip for disabled Edit entry button',
        defaultMessage: 'This entry can no longer be edited'
    },
    version: {
        id: 'app.entry.version',
        description: 'entry version',
        defaultMessage: 'version'
    },
    olderVersion: {
        id: 'app.entry.olderVersion',
        description: 'entry subtitle for reading older versions',
        defaultMessage: 'You are now viewing an older'
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
    upvote: {
        id: 'app.entry.upvote',
        description: 'upvote button tooltip',
        defaultMessage: 'Upvote'
    },
    votePending: {
        id: 'app.entry.votePending',
        description: 'tooltip for vote button in pending state',
        defaultMessage: 'Your vote is pending'
    },
    votingOwnComment: {
        id: 'app.entry.votingOwnComment',
        description: 'tooltip for vote button for your own comment',
        defaultMessage: 'You cannot vote your own comment'
    },
    votingOwnEntry: {
        id: 'app.entry.votingOwnEntry',
        description: 'tooltip for vote button for your own entry',
        defaultMessage: 'You cannot vote your own entry'
    },
    votingPeriod: {
        id: 'app.entry.votingPeriod',
        description: 'voting period for an entry has ended',
        defaultMessage: 'The voting period has ended'
    },
    votingPeriodDisclaimer: {
        id: 'app.entry.votingPeriodDisclaimer',
        description: 'disclaimer message about voting period',
        defaultMessage: 'Users can still vote on the entry but the mana burned for these votes can\'t be collected by the author or the voters.'
    },
});
export { entryMessages };
