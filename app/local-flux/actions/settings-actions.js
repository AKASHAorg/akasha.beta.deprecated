import * as types from '../constants';
import { action } from './helpers';

export const generalSettingsError = error => {
    error.code = 'GSE02';
    error.messageId = 'generalSettings';
    return action(types.GENERAL_SETTINGS_ERROR, { error });
};

export const generalSettingsRequest = () => action(types.GENERAL_SETTINGS);
export const generalSettingsSuccess = data => action(types.GENERAL_SETTINGS_SUCCESS, { data });
export const gethSaveSettings = (payload, showNotification) =>
    action(types.GETH_SAVE_SETTINGS, { payload, showNotification });

export const gethSaveSettingsError = error => {
    error.code = 'GSSE01';
    error.messageId = 'gethSaveSettings';
    return action(types.GETH_SAVE_SETTINGS_ERROR, { error });
};

export const gethSaveSettingsSuccess = data => action(types.GETH_SAVE_SETTINGS_SUCCESS, { data });

export const gethSettingsError = error => {
    error.code = 'GSE03';
    error.messageId = 'gethSettings';
    return action(types.GETH_SETTINGS_ERROR, { error });
};

export const gethSettingsRequest = () => action(types.GETH_SETTINGS);
export const gethSettingsSuccess = data => action(types.GETH_SETTINGS_SUCCESS, { data });
export const ipfsSaveSettings = (payload, showNotification) =>
    action(types.IPFS_SAVE_SETTINGS, { payload, showNotification });

export const ipfsSaveSettingsError = error => {
    error.code = 'ISSE01';
    error.messageId = 'ipfsSaveSettings';
    return action(types.IPFS_SAVE_SETTINGS_ERROR, { error });
};

export const ipfsSaveSettingsSuccess = data => action(types.IPFS_SAVE_SETTINGS_SUCCESS, { data });

export const ipfsSettingsError = error => {
    error.code = 'ISE01';
    error.messageId = 'ipfsSettings';
    return action(types.IPFS_SETTINGS_ERROR, { error });
};

export const ipfsSettingsSuccess = data => action(types.IPFS_SETTINGS_SUCCESS, { data });
export const ipfsSettingsRequest = () => action(types.IPFS_SETTINGS);
export const saveConfiguration = payload => action(types.SAVE_CONFIGURATION, { payload });
export const saveGeneralSettings = payload => action(types.GENERAL_SETTINGS_SAVE, { payload });

export const saveGeneralSettingsError = error => {
    error.code = 'SGSE01';
    error.messageId = 'saveGeneralSettings';
    return action(types.GENERAL_SETTINGS_SAVE_ERROR, { error });
};

export const saveGeneralSettingsSuccess = data => action(types.GENERAL_SETTINGS_SAVE_SUCCESS, { data });
export const userSettingsClear = () => action(types.USER_SETTINGS_CLEAR);
export const userSettingsRequest = ethAddress => action(types.USER_SETTINGS_REQUEST, { ethAddress });

export const userSettingsError = error => {
    error.code = 'USE01';
    error.messageId = 'userSettingsRequest';
    return action(types.USER_SETTINGS_ERROR, { error });
};

export const userSettingsAddTrustedDomain = (ethAddress, domain) =>
    action(types.USER_SETTINGS_ADD_TRUSTED_DOMAIN, { ethAddress, domain });

export const userSettingsAddTrustedDomainError = error => {
    error.code = 'USATDE01';
    return action(types.USER_SETTINGS_ADD_TRUSTED_DOMAIN_ERROR, { error });
};

export const userSettingsAddTrustedDomainSuccess = data =>
    action(types.USER_SETTINGS_ADD_TRUSTED_DOMAIN_SUCCESS, { data });

export const userSettingsSave = (ethAddress, payload) =>
    action(types.USER_SETTINGS_SAVE, { ethAddress, payload });

export const userSettingsSaveError = error => {
    error.code = 'USSE01';
    error.messageId = 'userSettingsSave';
    return action(types.USER_SETTINGS_SAVE_ERROR, { error });
};

export const userSettingsSaveSuccess = data => action(types.USER_SETTINGS_SAVE_SUCCESS, { data });
export const userSettingsSuccess = data => action(types.USER_SETTINGS_SUCCESS, { data });
