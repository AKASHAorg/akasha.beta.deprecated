import * as types from '../constants';
import { action } from './helpers';

export const appReady = () => action(types.APP_READY);

export const appSettingsToggle = () => action(types.APP_SETTINGS_TOGGLE);

export const bootstrapHome = () => action(types.BOOTSTRAP_HOME);
export const bootstrapHomeSuccess = () => action(types.BOOTSTRAP_HOME_SUCCESS);

export const hideNotification = notification =>
    action(types.HIDE_NOTIFICATION, { notification });
export const hidePreview = () => action(types.HIDE_PREVIEW);
export const hideReportModal = () => action(types.HIDE_REPORT_MODAL);
export const hideTerms = () => action(types.HIDE_TERMS);
export const notificationDisplay = notification => action(types.NOTIFICATION_DISPLAY, { notification });

// for publishing to blockchain
export const publishEntity = data => action(types.PUBLISH_ENTITY, { data });

export const profileEditToggle = () => action(types.PROFILE_EDIT_TOGGLE);

// this should be removed once profile logout is implemented
export const resetHomeReady = () => action(types.RESET_HOME_READY);

// toggle secondary sidebar visibility. this affects topBar, secondarySidebar and pageContent components.
// when forceToggle is defined it takes priority.
export const secondarySidebarToggle = ({ forceToggle }) =>
    action(types.SECONDARY_SIDEBAR_TOGGLE, { forceToggle });

export const showNotification = notification =>
    action(types.SHOW_NOTIFICATION, { notification });
export const showPreview = ({ columnType, value }) => action(types.SHOW_PREVIEW, { columnType, value });
export const showReportModal = data => action(types.SHOW_REPORT_MODAL, { data });
export const showTerms = () => action(types.SHOW_TERMS);
export const toggleAethWallet = () => action(types.TOGGLE_AETH_WALLET);
export const toggleEthWallet = () => action(types.TOGGLE_ETH_WALLET);
export const toggleGethDetailsModal = () => action(types.TOGGLE_GETH_DETAILS_MODAL);
export const toggleIpfsDetailsModal = () => action(types.TOGGLE_IPFS_DETAILS_MODAL);
export const toggleOutsideNavigation = url => action(types.TOGGLE_OUTSIDE_NAVIGATION_MODAL, { url });
