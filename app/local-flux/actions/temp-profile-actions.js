import * as types from '../constants';
import { action } from './helpers';

export const tempProfileCreate = data => action(types.TEMP_PROFILE_CREATE, { data });
export const tempProfileCreateSuccess = data => action(types.TEMP_PROFILE_CREATE_SUCCESS, { data });
export const tempProfileCreateError = error => action(types.TEMP_PROFILE_CREATE_ERROR, { error });

export const setTempProfile = data => action(types.SET_TEMP_PROFILE, { data });

export const tempProfileDelete = ethAddress => action(types.TEMP_PROFILE_DELETE, { ethAddress });

export const tempProfileDeleteFull = ethAddress => action(types.TEMP_PROFILE_DELETE_FULL, { ethAddress });

export const tempProfileUpdate = data => action(types.TEMP_PROFILE_UPDATE, { data });

export const tempProfileGet = ethAddress => action(types.TEMP_PROFILE_GET, { ethAddress });
export const tempProfileGetSuccess = data => action(types.TEMP_PROFILE_GET_SUCCESS, { data });
export const tempProfileGetError = error => action(types.TEMP_PROFILE_GET_ERROR, { error });

export const tempProfileError = error => {
    error.code = 'TPRE01';
    error.messageId = 'tempProfileRequest';
    return action(types.TEMP_PROFILE_ERROR, { error });
};
