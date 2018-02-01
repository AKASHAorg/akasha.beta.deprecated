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
        defaultMessage: 'Article'
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
    cannotExtractWebsiteInfo: {
        id: 'app.entry.cannotExtractWebsiteInfo',
        description: 'error shown when we cannot extract wesite info',
        defaultMessage: 'Cannot extract information from website! Please try another address'
    },
    cannotRetrieveLicense: {
        id: 'app.entry.cannotRetrieveLicense',
        description: 'message to show when a licence cannot be retrieved or it was not saved correctly',
        defaultMessage: 'Cannot retrieve licence info.'
    },
    imageCaptionPlaceholder: {
        id: 'app.entry.imageCaptionPlaceholder',
        description: 'text for caption input placeholder',
        defaultMessage: 'add a caption'
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
    draftDeleteConfirmation: {
        id: 'app.entry.draftDeleteConfirm',
        description: 'message to show when user wants to delete a draft',
        defaultMessage: 'Are you sure you want to delete this draft?'
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
    enterWebAddress: {
        id: 'app.entry.enterWebAddress',
        description: 'placeholder for link entry address field',
        defaultMessage: 'Enter an address. eg. www.akasha.world'
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
    hiddenContent: {
        id: 'app.entry.hiddenContent',
        description: 'message for hidden content due to score lower than user\'s preferences',
        defaultMessage: 'This content has a score lower than {score}.'
    },
    hiddenContent2: {
        id: 'app.entry.hiddenContent2',
        description: 'message for hidden content due to score lower than user\'s preferences (part 2)',
        defaultMessage: 'You can change this value from your'
    },
    hiddenContent3: {
        id: 'app.entry.hiddenContent3',
        description: 'message for hidden content due to score lower than user\'s preferences (part 3)',
        defaultMessage: 'personal settings'
    },
    license: {
        id: 'app.entry.license',
        description: 'License label',
        defaultMessage: 'License'
    },
    linkEntryType: {
        id: 'app.entry.linkEntryType',
        description: 'entry of type link',
        defaultMessage: 'Link'
    },
    loadMoreReplies: {
        id: 'app.entry.loadMoreReplies',
        description: 'label for load more replies button',
        defaultMessage: 'Load more replies'
    },
    loadingDrafts: {
        id: 'app.entry.loadingDrafts',
        description: 'message to show when drafts are loading',
        defaultMessage: 'Loading drafts...'
    },
    localVersion: {
        id: 'app.entry.localVersion',
        description: 'label for local version of an entry',
        defaultMessage: 'Local version'
    },
    makeSureToOpenDApp: {
        id: 'app.entry.makeSureToOpenDApp',
        description: 'Message',
        defaultMessage: 'Make sure to open AKASHA dApp on the computer you have published from.'
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
        defaultMessage: 'No comments yet.'
    },
    noDraftsFoundOnSearch: {
        id: 'app.noDraftsFoundOnSearch',
        description: 'when user searches for a draft and nothing found',
        defaultMessage: 'No drafts matching your search criteria were found.'
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
    nothingToCollect: {
        id: 'app.entry.nothingToCollect',
        description: 'explainer message for not being able to collect when balance is 0 Essence',
        defaultMessage: 'There is no Essence to collect from this entry'
    },
    noTitle: {
        id: 'app.entry.noTitle',
        description: 'when a draft has no title',
        defaultMessage: 'New draft'
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
    oneOfTheTagsCannotBeUsed: {
        id: 'app.entry.oneOfTheTagsCannotBeUsed',
        description: 'cannot use a tag',
        defaultMessage: 'One of the tags cannot be used!'
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
    resolvingIpfsHash: {
        id: 'app.entry.resolvingIpfsHash',
        description: 'message to show when an ipfs hash is in resolving state',
        defaultMessage: 'Resolving ipfs hash...'
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
    showAnyway: {
        id: 'app.entry.showAnyway',
        description: 'button label for showing hidded content',
        defaultMessage: 'Show anyway'
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
    startANewDraft: {
        id: 'app.entry.startANewDraft',
        description: 'message to start a new draft',
        defaultMessage: 'Create a draft now!'
    },
    title: {
        id: 'app.entry.title',
        description: 'placeholder for draft title input',
        defaultMessage: 'Title'
    },
    titleRequired: {
        id: 'app.entry.titleRequired',
        description: 'validation message in case of missing title field',
        defaultMessage: 'Title must not be empty'
    },
    tooltipAuthor: {
        id: 'app.entry.tooltipAuthor',
        description: 'error message in case author cannot be resolved',
        defaultMessage: 'Cannot resolve entry author'
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
    websiteInfoFetchingError: {
        id: 'app.entry.websiteInfoFetchingError',
        description: 'error shown when fetching website info failed',
        defaultMessage: 'An error occured while trying to fetch website info'
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
    youHaveNoDrafts: {
        id: 'app.entry.youHaveNoDrafts',
        description: 'Message shown when all drafts are deleted',
        defaultMessage: 'You have no drafts.'
    },
    draftAll: {
        id: 'app.entry.draftAll',
        description: 'all drafts',
        defaultMessage: 'All Drafts'
    },
    entriesAll: {
        id: 'app.entry.entriesAll',
        description: '',
        defaultMessage: 'All Entries'
    },
    publishedAll: {
        id: 'app.entry.publishedAll',
        description: 'all published entries',
        defaultMessage: 'All entries'
    },
    draftEntryCategory: {
        id: 'app.entry.draftEntryCategory',
        description: 'entry type suffix by category',
        defaultMessage: 'drafts'
    },
    publishedEntryCategory: {
        id: 'app.entry.publishedEntryCategory',
        description: 'entry type suffix by category',
        defaultMessage: 'entries'
    },
    gotoMyDrafts: {
        id: 'app.entry.gotoMyDrafts',
        description: 'go to my drafts button label',
        defaultMessage: 'Go to my drafts'
    },
    myEntries: {
        id: 'app.entry.myEntries',
        description: 'my entries label title',
        defaultMessage: 'My Entries'
    },
    draftRevert: {
        id: 'app.entry.draftRevert',
        description: 'button label to revert changes',
        defaultMessage: 'Revert changes'
    },
    linkDisabled: {
        id: 'app.entry.linkDisabled',
        description: 'tooltip for link button in comment editor',
        defaultMessage: 'You must select some text first'
    },
    linkPlaceholder: {
        id: 'app.entry.linkPlaceholder',
        description: 'placeholder for the link input in editors',
        defaultMessage: 'Type the link and press enter'
    },
    loadingImage: {
        id: 'app.entry.loadingImage',
        description: 'placeholder when an image is loading',
        defaultMessage: 'Loading image'
    },
    entries: {
        id: 'app.entry.entries',
        description: 'plural form of entry! :)',
        defaultMessage: 'entries'
    },
    leaveAComment: {
        id: 'app.leaveAComment',
        description: 'when user searches for a draft and nothing found',
        defaultMessage: 'Be the first one to write a comment!'
    },
});
export { entryMessages };
