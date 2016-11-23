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
