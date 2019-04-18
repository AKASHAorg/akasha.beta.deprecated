import * as types from '../constants';
import { action } from './helpers';

export const claimableDeleteEntry = (entryId) => action(types.CLAIMABLE_DELETE_ENTRY, { entryId });
export const claimableDeleteEntryError = (error) => {
    error.code = 'CDEE01';
    error.messageId = 'claimableDeleteEntry';
    return action(types.CLAIMABLE_DELETE_ENTRY_ERROR, { error });
};
export const claimableDeleteEntrySuccess = data => action(types.CLAIMABLE_DELETE_ENTRY_SUCCESS, { data });

export const claimableDeleteLoading = (entryId) => action(types.CLAIMABLE_DELETE_LOADING, { entryId });

export const claimableGetEntries = (more) => action(types.CLAIMABLE_GET_ENTRIES, { more });
export const claimableGetEntriesError = (error, request) => {
    error.code = 'CGEE01';
    error.messageId = 'claimableGetEntries';
    return action(types.CLAIMABLE_GET_ENTRIES_ERROR, { error, request });
};
export const claimableGetEntriesSuccess = (data, request) =>
    action(types.CLAIMABLE_GET_ENTRIES_SUCCESS, { data, request });

export const claimableGetStatus = () => action(types.CLAIMABLE_GET_STATUS);
export const claimableGetStatusError = (error) => {
    error.code = 'CGSE02';
    error.messageId = 'claimableGetStatus';
    return action(types.CLAIMABLE_GET_STATUS_ERROR, { error });
};

export const claimableIterator = () => action(types.CLAIMABLE_ITERATOR);
export const claimableIteratorError = (error) => {
    error.code = 'CIE02';
    error.messageId = 'claimableIterator';
    return action(types.CLAIMABLE_ITERATOR, { error });
};
export const claimableIteratorSuccess = (data, request) =>
    action(types.CLAIMABLE_ITERATOR_SUCCESS, { data, request });

export const claimableSaveEntriesError = (error) => {
    error.code = 'CSEE01';
    error.messageId = 'claimableSaveEntries';
    return action(types.CLAIMABLE_SAVE_ENTRIES_ERROR, { error })
}
