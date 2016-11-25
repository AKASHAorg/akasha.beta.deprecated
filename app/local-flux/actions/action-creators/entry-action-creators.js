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
export function getProfileEntries (flags) {
    return {
        type: types.GET_PROFILE_ENTRIES,
        flags
    };
}
export function getProfileEntriesSuccess (data, flags) {
    return {
        type: types.GET_PROFILE_ENTRIES_SUCCESS,
        data,
        flags
    };
}

export function getProfileEntriesError (error, flags) {
    return {
        type: types.GET_PROFILE_ENTRIES_ERROR,
        error,
        flags
    };
}

export function createSavedEntrySuccess (entry) {
    return {
        type: types.CREATE_SAVED_ENTRY_SUCCESS,
        entry
    };
}

export function createSavedEntryError (error) {
    return {
        type: types.CREATE_SAVED_ENTRY_ERROR,
        error
    };
}

export function getSavedEntriesSuccess (entries) {
    return {
        type: types.GET_SAVED_ENTRIES_SUCCESS,
        entries
    };
}

export function getSavedEntriesError (error) {
    return {
        type: types.GET_SAVED_ENTRIES_ERROR,
        error
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
