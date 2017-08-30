import * as types from '../constants';
import { action } from './helpers';

export const highlightDelete = id => action(types.HIGHLIGHT_DELETE, { id });

export const highlightDeleteError = (error) => {
    error.code = 'HDE01';
    error.messageId = 'highlightDelete';
    return action(types.HIGHLIGHT_DELETE_ERROR, { error });
};

export const highlightDeleteSuccess = id => action(types.HIGHLIGHT_DELETE_SUCCESS, { id });
export const highlightEditNotes = (id, notes) => action(types.HIGHLIGHT_EDIT_NOTES, { id, notes });

export const highlightEditNotesError = (error) => {
    error.code = 'HENE01';
    error.messageId = 'highlightEditNotes';
    return action(types.HIGHLIGHT_EDIT_NOTES_ERROR, { error });
};

export const highlightEditNotesSuccess = data =>
    action(types.HIGHLIGHT_EDIT_NOTES_SUCCESS, { data });

export const highlightGetAllError = (error) => {
    error.code = 'HGAE01';
    error.messageId = 'highlightGetAll';
    return action(types.HIGHLIGHT_GET_ALL_ERROR, { error });
};

export const highlightGetAllSuccess = data => action(types.HIGHLIGHT_GET_ALL_SUCCESS, { data });
export const highlightSave = payload => action(types.HIGHLIGHT_SAVE, { payload });

export const highlightSaveError = (error) => {
    error.code = 'HSE01';
    error.messageId = 'highlightSave';
    return action(types.HIGHLIGHT_SAVE_ERROR, { error });
};

export const highlightSaveSuccess = data => action(types.HIGHLIGHT_SAVE_SUCCESS, { data });
export const highlightSearch = search => action(types.HIGHLIGHT_SEARCH, { search });

export const highlightSearchError = (error) => {
    error.code = 'HSE02';
    error.messageId = 'highlightSearch';
    return action(types.HIGHLIGHT_SEARCH_ERROR, { error });
};

export const highlightSearchSuccess = data => action(types.HIGHLIGHT_SEARCH_SUCCESS, { data });
