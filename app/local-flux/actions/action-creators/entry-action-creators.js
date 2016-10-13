import * as types from '../../constants/EntryConstants';

export function getEntriesCountSuccess (count) {
    return {
        type: types.GET_ENTRIES_COUNT_SUCCESS,
        count
    };
}

export function getEntriesCountError (error) {
    return {
        type: types.GET_ENTRIES_COUNT_ERROR,
        error
    };
}

export function checkTagExistenceSuccess (result) {
    return {
        type: types.CHECK_TAG_EXISTENCE_SUCCESS,
        result
    };
}

export function checkTagExistence () {
    return {
        type: types.CHECK_TAG_EXISTENCE
    };
}

export function checkTagExistenceError (error) {
    return {
        type: types.CHECK_TAG_EXISTENCE_ERROR,
        error
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
    console.error(error);
    return {
        type: types.GET_SAVED_ENTRIES_ERROR,
        error
    };
}
