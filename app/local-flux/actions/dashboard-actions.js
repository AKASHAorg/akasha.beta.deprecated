import { action } from './helpers';
import * as types from '../constants';

export const dashboardAdd = (name, columns) => action(types.DASHBOARD_ADD, { name, columns });

export const dashboardAddError = (error) => {
    error.code = 'DAE01';
    error.messageId = 'dashboardAdd';
    return action(types.DASHBOARD_ADD_ERROR, { error });
};

export const dashboardAddSuccess = data => action(types.DASHBOARD_ADD_SUCCESS, { data });

export const dashboardAddFirst = interests => action(types.DASHBOARD_ADD_FIRST, { interests });
export const dashboardAddFirstSuccess = () => action(types.DASHBOARD_ADD_FIRST_SUCCESS);

export const dashboardAddColumn = (columnType, value) =>
    action(types.DASHBOARD_ADD_COLUMN, { columnType, value });

export const dashboardAddColumnError = (error) => {
    error.code = 'DACE01';
    error.messageId = 'dashboardAddColumn';
    return action(types.DASHBOARD_ADD_COLUMN_ERROR, { error });
};

export const dashboardAddColumnSuccess = data =>
    action(types.DASHBOARD_ADD_COLUMN_SUCCESS, { data });
export const dashboardAddNewColumn = () => action(types.DASHBOARD_ADD_NEW_COLUMN);
export const dashboardDelete = name =>
    action(types.DASHBOARD_DELETE, { name });

export const dashboardDeleteError = (error) => {
    error.code = 'DDE01';
    error.messageId = 'dashboardDelete';
    return action(types.DASHBOARD_DELETE_ERROR, { error });
};

export const dashboardDeleteSuccess = data =>
    action(types.DASHBOARD_DELETE_SUCCESS, { data });
export const dashboardDeleteColumn = columnId =>
    action(types.DASHBOARD_DELETE_COLUMN, { columnId });

export const dashboardDeleteColumnError = (error) => {
    error.code = 'DDCE01';
    error.messageId = 'dashboardDeleteColumn';
    return action(types.DASHBOARD_DELETE_COLUMN_ERROR, { error });
};

export const dashboardDeleteColumnSuccess = data =>
    action(types.DASHBOARD_DELETE_COLUMN_SUCCESS, { data });

export const dashboardGetActiveError = (error) => {
    error.code = 'DGAE01';
    error.messageId = 'dashboardGetActive';
    return action(types.DASHBOARD_GET_ACTIVE_ERROR, { error });
};

export const dashboardGetActiveSuccess = data =>
    action(types.DASHBOARD_GET_ACTIVE_SUCCESS, { data });

export const dashboardGetAllError = (error) => {
    error.code = 'DGAE02';
    error.messageId = 'dashboardGetAll';
    return action(types.DASHBOARD_GET_ALL_ERROR, { error });
};

export const dashboardGetAllSuccess = data => action(types.DASHBOARD_GET_ALL_SUCCESS, { data });
export const dashboardGetProfileSuggestions = (akashaId, columnId) =>
    action(types.DASHBOARD_GET_PROFILE_SUGGESTIONS, { akashaId, columnId });

export const dashboardGetProfileSuggestionsError = (error, request) => {
    error.code = 'DGTSE01';
    error.messageId = 'dashboardGetProfileSuggestions';
    return action(types.DASHBOARD_GET_PROFILE_SUGGESTIONS_ERROR, { error, request });
};

export const dashboardGetProfileSuggestionsSuccess = (data, request) =>
    action(types.DASHBOARD_GET_PROFILE_SUGGESTIONS_SUCCESS, { data, request });


export const dashboardGetTagSuggestions = (tag, context, columnId) =>
    action(types.DASHBOARD_GET_TAG_SUGGESTIONS, { tag, context, columnId });

export const dashboardGetTagSuggestionsError = (error, request) => {
    error.code = 'DGTSE01';
    error.messageId = 'dashboardGetTagSuggestions';
    return action(types.DASHBOARD_GET_TAG_SUGGESTIONS_ERROR, { error, request });
};

export const dashboardGetTagSuggestionsSuccess = (data, request) =>
    action(types.DASHBOARD_GET_TAG_SUGGESTIONS_SUCCESS, { data, request });

export const dashboardSearch = query => action(types.DASHBOARD_SEARCH, { query });

export const dashboardSetActive = name => action(types.DASHBOARD_SET_ACTIVE, { name });

export const dashboardSetActiveError = (error) => {
    error.code = 'DSAE01';
    error.messageId = 'dashboardSetActive';
    return action(types.DASHBOARD_SET_ACTIVE_ERROR, { error });
};

export const dashboardSetActiveSuccess = data =>
    action(types.DASHBOARD_SET_ACTIVE_SUCCESS, { data });
export const dashboardToggleTagColumn = (dashboardId, tag) =>
    action(types.DASHBOARD_TOGGLE_TAG_COLUMN, { dashboardId, tag });

export const dashboardToggleTagColumnError = (error) => {
    error.code = 'DTTCE01';
    error.messageId = 'dashboardToggleTagColumn';
    return action(types.DASHBOARD_TOGGLE_TAG_COLUMN_ERROR, { error });
};

export const dashboardToggleTagColumnSuccess = data =>
    action(types.DASHBOARD_TOGGLE_TAG_COLUMN_SUCCESS, { data });
export const dashboardUpdateColumn = (id, changes) =>
    action(types.DASHBOARD_UPDATE_COLUMN, { id, changes });

export const dashboardUpdateColumnError = (error) => {
    error.code = 'DUCE01';
    error.messageId = 'dashboardUpdateColumn';
    return action(types.DASHBOARD_UPDATE_COLUMN_ERROR, { error });
};

export const dashboardUpdateColumnSuccess = data =>
    action(types.DASHBOARD_UPDATE_COLUMN_SUCCESS, { data });
export const dashboardUpdateNewColumn = changes =>
    action(types.DASHBOARD_UPDATE_NEW_COLUMN, { changes });
