import { action } from './helpers';
import * as types from '../constants';

export const dashboardAdd = (name, columns) => action(types.DASHBOARD_ADD, { name, columns });

export const dashboardAddError = (error) => {
    error.code = 'DAE01';
    error.messageId = 'dashboardAdd';
    return action(types.DASHBOARD_ADD_ERROR, { error });
};

export const dashboardAddSuccess = data => action(types.DASHBOARD_ADD_SUCCESS, { data });

export const dashboardAddFirst = (name, interests) => action(types.DASHBOARD_ADD_FIRST, { name, interests });
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
export const dashboardDelete = id =>
    action(types.DASHBOARD_DELETE, { id });

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
export const dashboardDeleteNewColumn = () => action(types.DASHBOARD_DELETE_NEW_COLUMN);

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
export const dashboardRename = (dashboardId, newName) =>
    action(types.DASHBOARD_RENAME, { dashboardId, newName });

export const dashboardRenameError = (error) => {
    error.code = 'DRE01';
    error.messageId = 'dashboardRename';
    return action(types.DASHBOARD_RENAME_ERROR, { error });
};

export const dashboardRenameSuccess = data => action(types.DASHBOARD_RENAME_SUCCESS, { data });
export const dashboardResetNewColumn = () => action(types.DASHBOARD_RESET_NEW_COLUMN);
export const dashboardSearch = query => action(types.DASHBOARD_SEARCH, { query });
export const dashboardSetActive = id => action(types.DASHBOARD_SET_ACTIVE, { id });

export const dashboardSetActiveError = (error) => {
    error.code = 'DSAE01';
    error.messageId = 'dashboardSetActive';
    return action(types.DASHBOARD_SET_ACTIVE_ERROR, { error });
};

export const dashboardSetActiveSuccess = data =>
    action(types.DASHBOARD_SET_ACTIVE_SUCCESS, { data });

export const dashboardToggleProfileColumn = (dashboardId, ethAddress) =>
    action(types.DASHBOARD_TOGGLE_PROFILE_COLUMN, { dashboardId, ethAddress });
export const dashboardToggleProfileColumnError = (error) => {
    error.code = 'DTPCE01';
    error.messageId = 'dashboardToggleProfileColumn';
    return action(types.DASHBOARD_TOGGLE_PROFILE_COLUMN_ERROR, { error });
};
export const dashboardToggleProfileColumnSuccess = data =>
    action(types.DASHBOARD_TOGGLE_PROFILE_COLUMN_SUCCESS, { data });

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
