import { action } from './helpers';
import * as types from '../constants';

export const listAdd = ({ name, description, entryIds }) =>
    action(types.LIST_ADD, { name, description, entryIds });

export const listAddError = (error) => {
    error.code = 'LAE01';
    error.messageId = 'listAdd';
    return action(types.LIST_ADD_ERROR, { error });
};

export const listAddSuccess = data => action(types.LIST_ADD_SUCCESS, { data });
export const listDelete = (listId, name) => action(types.LIST_DELETE, { listId, name });
export const listDeleteEntry = (name, entryId) => action(types.LIST_DELETE_ENTRY, { name, entryId });

export const listDeleteEntryError = (error) => {
    error.code = 'LDEE01';
    error.messageId = 'listDeleteEntry';
    return action(types.LIST_DELETE_ENTRY_ERROR, { error });
};

export const listDeleteEntrySuccess = data => action(types.LIST_DELETE_ENTRY_SUCCESS, { data });

export const listDeleteError = (error) => {
    error.code = 'LDE01';
    error.messageId = 'listDelete';
    return action(types.LIST_DELETE_ERROR, { error });
};

export const listDeleteSuccess = name => action(types.LIST_DELETE_SUCCESS, { name });

export const listGetAllError = (error) => {
    error.code = 'LGAE01';
    error.messageId = 'listGetAll';
    return action(types.LIST_GET_ALL_ERROR, { error });
};

export const listGetAllSuccess = data => action(types.LIST_GET_ALL_SUCCESS, { data });

export const listGetFull = name => action(types.LIST_GET_FULL, { name });

export const listGetFullError = (error) => {
    error.code = 'LGFE01';
    error.messageId = 'listGetFull';
    return action(types.LIST_GET_FULL_ERROR, { error });
};

export const listGetFullSucess = data => action(types.LIST_GET_FULL_SUCCESS, { data });
export const listSearch = search => action(types.LIST_SEARCH, { search });

export const listSearchError = (error) => {
    error.code = 'LSE01';
    error.messageId = 'listSearch';
    return action(types.LIST_SEARCH_ERROR, { error });
};

export const listSearchSuccess = data => action(types.LIST_SEARCH_SUCCESS, { data });

export const listUpdateEntryIds = (listNames, entryId) =>
    action(types.LIST_UPDATE_ENTRY_IDS, { listNames, entryId });

export const listUpdateEntryIdsError = (error) => {
    error.code = 'LUEIE01';
    error.messageId = 'listUpdateEntryIds';
    return action(types.LIST_UPDATE_ENTRY_IDS_ERROR, { error });
};

export const listUpdateEntryIdsSuccess = data => action(types.LIST_UPDATE_ENTRY_IDS_SUCCESS, { data });
