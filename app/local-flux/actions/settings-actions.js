import * as types from '../constants';
import { action } from './helpers';

export const getAppSettingsError = error => action(types.GET_APP_SETTINGS_ERROR, { error });

export const getAppSettings = () => action(types.GET_APP_SETTINGS);
export const getAppSettingsSuccess = payload => action(types.GET_APP_SETTINGS_SUCCESS, payload);
export const gethSaveSettings = (payload, showNotification) =>
    action(types.GETH_SAVE_SETTINGS, { payload, showNotification });

export const gethSaveSettingsError = error => action(types.GETH_SAVE_SETTINGS_ERROR, { error });

export const gethSaveSettingsSuccess = payload => action(types.GETH_SAVE_SETTINGS_SUCCESS, payload);

export const gethSettingsError = error => action(types.GETH_SETTINGS_ERROR, { error });

export const gethSettingsRequest = () => action(types.GETH_SETTINGS);
export const gethSettingsSuccess = payload => action(types.GETH_SETTINGS_SUCCESS, payload);
export const ipfsSaveSettings = (payload, showNotification) =>
    action(types.IPFS_SAVE_SETTINGS, { payload, showNotification });

export const ipfsSaveSettingsError = error => action(types.IPFS_SAVE_SETTINGS_ERROR, { error });

export const ipfsSaveSettingsSuccess = payload => action(types.IPFS_SAVE_SETTINGS_SUCCESS, payload);

export const ipfsSettingsError = error => action(types.IPFS_SETTINGS_ERROR, { error });

export const ipfsSettingsSuccess = payload => action(types.IPFS_SETTINGS_SUCCESS, payload);
export const ipfsSettingsRequest = () => action(types.IPFS_SETTINGS);
export const saveConfiguration = payload => action(types.SAVE_CONFIGURATION, payload);
export const saveGeneralSettings = payload => action(types.GENERAL_SETTINGS_SAVE, payload);

export const saveGeneralSettingsError = error => action(types.GENERAL_SETTINGS_SAVE_ERROR, { error });

export const saveGeneralSettingsSuccess = payload => action(types.GENERAL_SETTINGS_SAVE_SUCCESS, payload);
export const userSettingsClear = () => action(types.USER_SETTINGS_CLEAR);
export const userSettingsRequest = ethAddress => action(types.USER_SETTINGS_REQUEST, { ethAddress });

export const userSettingsError = error => action(types.USER_SETTINGS_ERROR, { error });

export const userSettingsAddTrustedDomain = (ethAddress, domain) =>
    action(types.USER_SETTINGS_ADD_TRUSTED_DOMAIN, { ethAddress, domain });

export const userSettingsAddTrustedDomainError = error =>
    action(types.USER_SETTINGS_ADD_TRUSTED_DOMAIN_ERROR, { error });

export const userSettingsAddTrustedDomainSuccess = payload =>
    action(types.USER_SETTINGS_ADD_TRUSTED_DOMAIN_SUCCESS, payload);

export const userSettingsSave = payload => action(types.USER_SETTINGS_SAVE, payload);

export const userSettingsSaveError = error => action(types.USER_SETTINGS_SAVE_ERROR, { error });

export const userSettingsSaveSuccess = payload => action(types.USER_SETTINGS_SAVE_SUCCESS, payload);
export const userSettingsSuccess = payload => action(types.USER_SETTINGS_SUCCESS, payload);
