import * as types from '../constants';
import { action } from './helpers';

export const highlightSave = payload => action(types.HIGHLIGHT_SAVE, { payload });

export const highlightSaveError = (error) => {
    error.code = 'HSE01';
    error.messageId = 'highlightSave';
    return action(types.HIGHLIGHT_SAVE_ERROR, { error });
};

export const highlightSaveSuccess = data => action(types.HIGHLIGHT_SAVE_SUCCESS, { data });
