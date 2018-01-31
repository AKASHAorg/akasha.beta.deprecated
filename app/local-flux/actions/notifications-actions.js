import { action } from './helpers';
import * as types from '../constants';

export const notificationsLoaded = () => action(types.NOTIFICATIONS_LOADED);
export const notificationsSubscribe = notificationsPreferences =>
    action(types.NOTIFICATIONS_SUBSCRIBE, { notificationsPreferences });
export const notificationsSubscribeError = (error) => {
    error.code = 'NSE01';
    return action(types.NOTIFICATIONS_SUBSCRIBE_ERROR, { error });
};
export const notificationsSubscribeSuccess = (data, isPanelOpen) =>
    action(types.NOTIFICATIONS_SUBSCRIBE_SUCCESS, { data, isPanelOpen });
