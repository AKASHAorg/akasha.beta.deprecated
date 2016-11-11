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
