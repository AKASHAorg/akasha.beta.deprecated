import * as types from '../../constants/EntryConstants';

export function getEntriesCount (flags) {
    return {
        type: types.GET_ENTRIES_COUNT,
        flags
    };
}

export function getEntriesCountSuccess (data, flags) {
    return {
        type: types.GET_ENTRIES_COUNT_SUCCESS,
        data,
        flags
    };
}

export function getEntriesCountError (error, flags) {
    return {
        type: types.GET_ENTRIES_COUNT_ERROR,
        error,
        flags
    };
}

export function getSortedEntries (entries) {
    return {
        type: types.GET_SORTED_ENTRIES,
        entries
    };
}
export function entryProfileIterator (flags) {
    return {
        type: types.ENTRY_PROFILE_ITERATOR,
        flags
    };
}
export function entryProfileIteratorSuccess (data, flags) {
    return {
        type: types.ENTRY_PROFILE_ITERATOR_SUCCESS,
        data,
        flags
    };
}

export function entryProfileIteratorError (error, flags) {
    return {
        type: types.ENTRY_PROFILE_ITERATOR_ERROR,
        error,
        flags
    };
}

export function moreEntryProfileIterator (flags) {
    return {
        type: types.MORE_ENTRY_PROFILE_ITERATOR,
        flags
    };
}
export function moreEntryProfileIteratorSuccess (data, flags) {
    return {
        type: types.MORE_ENTRY_PROFILE_ITERATOR_SUCCESS,
        data,
        flags
    };
}

export function moreEntryProfileIteratorError (error, flags) {
    error.code = 'MEPIE01';
    return {
        type: types.MORE_ENTRY_PROFILE_ITERATOR_ERROR,
        error,
        flags
    };
}

export function getSavedEntries (flags) {
    return {
        type: types.GET_SAVED_ENTRIES,
        flags
    };
}

export function getSavedEntriesSuccess (data, flags) {
    return {
        type: types.GET_SAVED_ENTRIES_SUCCESS,
        data,
        flags
    };
}

export function getSavedEntriesError (error, flags) {
    error.code = 'GSEE01';
    return {
        type: types.GET_SAVED_ENTRIES_ERROR,
        error,
        flags
    };
}

export function getSavedEntriesList (flags) {
    return {
        type: types.GET_SAVED_ENTRIES_LIST,
        flags
    };
}

export function getSavedEntriesListSuccess (data, flags) {
    return {
        type: types.GET_SAVED_ENTRIES_LIST_SUCCESS,
        data,
        flags
    };
}

export function getSavedEntriesListError (error, flags) {
    error.code = 'GSELE01';
    return {
        type: types.GET_SAVED_ENTRIES_LIST_ERROR,
        error,
        flags
    };
}

export function moreSavedEntriesList (flags) {
    return {
        type: types.MORE_SAVED_ENTRIES_LIST,
        flags
    };
}

export function moreSavedEntriesListSuccess (data, flags) {
    return {
        type: types.MORE_SAVED_ENTRIES_LIST_SUCCESS,
        data,
        flags
    };
}

export function moreSavedEntriesListError (error, flags) {
    error.code = 'MSELE01';
    return {
        type: types.MORE_SAVED_ENTRIES_LIST_ERROR,
        error,
        flags
    };
}

export function getLicencesSuccess (licences) {
    return {
        type: types.GET_LICENCES_SUCCESS,
        licences
    };
}

export function getLicencesError (error) {
    return {
        type: types.GET_LICENCES_ERROR,
        error
    };
}

export function getLicenceByIdSuccess (licence) {
    return {
        type: types.GET_LICENCE_BY_ID_SUCCESS,
        licence
    };
}

export function getLicenceByIdError (error) {
    return {
        type: types.GET_LICENCE_BY_ID_ERROR,
        error
    };
}

export function getEntriesStream (flags) {
    return {
        type: types.GET_ENTRIES_STREAM,
        flags
    };
}

export function getEntriesStreamSuccess (data, flags) {
    return {
        type: types.GET_ENTRIES_STREAM_SUCCESS,
        data,
        flags
    };
}

export function getEntriesStreamError (error, flags) {
    error.code = 'GESE01';
    return {
        type: types.GET_ENTRIES_STREAM_ERROR,
        error,
        flags
    };
}

export function entryTagIterator (flags) {
    return {
        type: types.ENTRY_TAG_ITERATOR,
        flags
    };
}

export function entryTagIteratorSuccess (data, flags) {
    return {
        type: types.ENTRY_TAG_ITERATOR_SUCCESS,
        data,
        flags
    };
}

export function entryTagIteratorError (error, flags) {
    error.code = 'ETIE01';
    return {
        type: types.ENTRY_TAG_ITERATOR_ERROR,
        error,
        flags
    };
}

export function moreEntryTagIterator (flags) {
    return {
        type: types.MORE_ENTRY_TAG_ITERATOR,
        flags
    };
}

export function moreEntryTagIteratorSuccess (data, flags) {
    return {
        type: types.MORE_ENTRY_TAG_ITERATOR_SUCCESS,
        data,
        flags
    };
}

export function moreEntryTagIteratorError (error, flags) {
    error.code = 'METIE01';
    return {
        type: types.MORE_ENTRY_TAG_ITERATOR_ERROR,
        error,
        flags
    };
}

export function getTagEntriesCount (flags) {
    return {
        type: types.GET_TAG_ENTRIES_COUNT,
        flags
    };
}

export function getTagEntriesCountSuccess (data, flags) {
    return {
        type: types.GET_TAG_ENTRIES_COUNT_SUCCESS,
        data,
        flags
    };
}

export function getTagEntriesCountError (error, flags) {
    error.code = 'GTECE01';
    return {
        type: types.GET_TAG_ENTRIES_COUNT_ERROR,
        error,
        flags
    };
}

export function clearTagEntries () {
    return {
        type: types.CLEAR_TAG_ENTRIES
    };
}

export function clearSavedEntries () {
    return {
        type: types.CLEAR_SAVED_ENTRIES
    };
}

export function clearProfileEntries () {
    return {
        type: types.CLEAR_PROFILE_ENTRIES
    };
}

export function voteCost (flags) {
    return {
        type: types.VOTE_COST,
        flags
    };
}

export function voteCostSuccess (data, flags) {
    return {
        type: types.VOTE_COST_SUCCESS,
        data,
        flags
    };
}

export function voteCostError (error, flags) {
    return {
        type: types.VOTE_COST_ERROR,
        error,
        flags
    };
}

export function upvote (flags) {
    return {
        type: types.UPVOTE,
        flags
    };
}

export function upvoteSuccess (flags) {
    return {
        type: types.UPVOTE_SUCCESS,
        flags
    };
}

export function upvoteError (error, flags) {
    return {
        type: types.UPVOTE_ERROR,
        error,
        flags
    };
}

export function downvote (flags) {
    return {
        type: types.DOWNVOTE,
        flags
    };
}

export function downvoteSuccess (flags) {
    return {
        type: types.DOWNVOTE_SUCCESS,
        flags
    };
}

export function downvoteError (error, flags) {
    return {
        type: types.DOWNVOTE_ERROR,
        error,
        flags
    };
}

export function getEntry (flags) {
    return {
        type: types.GET_ENTRY,
        flags
    };
}

export function getEntrySuccess (data, flags) {
    return {
        type: types.GET_ENTRY_SUCCESS,
        data,
        flags
    };
}

export function getEntryError (error, flags) {
    return {
        type: types.GET_ENTRY_ERROR,
        error,
        flags
    };
}

export function getFullEntry (flags) {
    return {
        type: types.GET_FULL_ENTRY,
        flags
    };
}

export function getFullEntrySuccess (data, flags) {
    return {
        type: types.GET_FULL_ENTRY_SUCCESS,
        data,
        flags
    };
}
export function unloadFullEntry () {
    return {
        type: types.UNLOAD_FULL_ENTRY
    };
}
export function getFullEntryError (error, flags) {
    return {
        type: types.GET_FULL_ENTRY_ERROR,
        error,
        flags
    };
}

export function getScore (flags) {
    return {
        type: types.GET_SCORE,
        flags
    };
}

export function getScoreSuccess (data, flags) {
    return {
        type: types.GET_SCORE_SUCCESS,
        data,
        flags
    };
}

export function getScoreError (error, flags) {
    return {
        type: types.GET_SCORE_ERROR,
        error,
        flags
    };
}

export function isActive (flags) {
    return {
        type: types.IS_ACTIVE,
        flags
    };
}

export function isActiveSuccess (data, flags) {
    return {
        type: types.IS_ACTIVE_SUCCESS,
        data,
        flags
    };
}

export function isActiveError (error, flags) {
    return {
        type: types.IS_ACTIVE_ERROR,
        error,
        flags
    };
}

export function getVoteOf (flags) {
    return {
        type: types.GET_VOTE_OF,
        flags
    };
}

export function getVoteOfSuccess (data, flags) {
    return {
        type: types.GET_VOTE_OF_SUCCESS,
        data,
        flags
    };
}

export function getVoteOfError (error, flags) {
    return {
        type: types.GET_VOTE_OF_ERROR,
        error,
        flags
    };
}

export function saveEntry (flags) {
    return {
        type: types.SAVE_ENTRY,
        flags
    };
}

export function saveEntrySuccess (data, flags) {
    return {
        type: types.SAVE_ENTRY_SUCCESS,
        data,
        flags
    };
}

export function saveEntryError (error, flags) {
    error.code = 'SEE01';
    return {
        type: types.SAVE_ENTRY_ERROR,
        error,
        flags
    };
}

export function deleteEntry (flags) {
    return {
        type: types.DELETE_ENTRY,
        flags
    };
}

export function deleteEntrySuccess (data, flags) {
    return {
        type: types.DELETE_ENTRY_SUCCESS,
        data,
        flags
    };
}

export function deleteEntryError (error, flags) {
    return {
        type: types.DELETE_ENTRY_ERROR,
        error,
        flags
    };
}
