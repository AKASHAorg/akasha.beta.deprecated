import { action } from './helpers';
import * as types from '../constants';

export const listAdd = ({ name, description, entryIds, addColumn }) =>
    action(types.LIST_ADD, { name, description, entryIds, addColumn });

export const listAddError = (error) => {
    error.code = 'LAE01';
    error.messageId = 'listAdd';
    return action(types.LIST_ADD_ERROR, { error });
};

export const listAddSuccess = data => action(types.LIST_ADD_SUCCESS, { data });
export const listDelete = id => action(types.LIST_DELETE, { id });
export const listDeleteEntry = (id, entryId) => action(types.LIST_DELETE_ENTRY, { id, entryId });

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

export const listDeleteSuccess = id => action(types.LIST_DELETE_SUCCESS, { id });

export const listEdit = ({ id, name, description }) =>
    action(types.LIST_EDIT, { id, name, description });

export const listEditError = (error) => {
    error.code = 'LEE01';
    error.messageId = 'listEdit';
    return action(types.LIST_EDIT_ERROR, { error });
};

export const listEditSuccess = data => action(types.LIST_EDIT_SUCCESS, { data });

export const listGetAllError = (error) => {
    error.code = 'LGAE01';
    error.messageId = 'listGetAll';
    return action(types.LIST_GET_ALL_ERROR, { error });
};

export const listGetAllSuccess = data => action(types.LIST_GET_ALL_SUCCESS, { data });

export const listGetFull = id => action(types.LIST_GET_FULL, { id });

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

export const listToggleEntry = (id, entryId, entryType, authorEthAddress) =>
    action(types.LIST_TOGGLE_ENTRY, { id, entryId, entryType, authorEthAddress });

export const listToggleEntryError = (error) => {
    error.code = 'LTEE01';
    error.messageId = 'listToggleEntry';
    return action(types.LIST_TOGGLE_ENTRY_ERROR, { error });
};

export const listToggleEntrySuccess = (data, request) =>
    action(types.LIST_TOGGLE_ENTRY_SUCCESS, { data, request });
