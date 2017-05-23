import * as types from '../constants';
import { action } from './helpers';

export const clearSyncStatus = () => action(types.CLEAR_SYNC_STATUS);
export const gethGetLogs = () => action(types.GETH_GET_LOGS);
export const gethGetLogsSuccess = data => action(types.GETH_GET_LOGS_SUCCESS, { data });

export const gethGetOptionsError = (error) => {
    error.code = 'GGOE01';
    error.messageId = 'gethGetOptions';
    return action(types.GETH_GET_OPTIONS_ERROR, { error });
};

export const gethGetOptionsSuccess = data => action(types.GETH_GET_OPTIONS_SUCCESS, { data });
export const gethGetStatus = () => action(types.GETH_GET_STATUS);

export const gethGetStatusError = (error) => {
    error.code = 'GGSE01';
    error.messageId = 'gethGetStatus';
    return action(types.GETH_GET_STATUS_ERROR, { error });
};

export const gethGetStatusSuccess = (data, services) =>
    action(types.GETH_GET_STATUS_SUCCESS, { data, services });
export const gethGetSyncStatus = () => action(types.GETH_GET_SYNC_STATUS);

export const gethGetSyncStatusError = (error) => {
    error.code = 'GGSSE01';
    error.messageId = 'gethGetSyncStatus';
    return action(types.GETH_GET_SYNC_STATUS_ERROR, { error });
};

export const gethGetSyncStatusSuccess = (data, services) =>
    action(types.GETH_GET_SYNC_STATUS_SUCCESS, { data, services });
export const gethPauseSync = () => action(types.GETH_PAUSE_SYNC);
export const gethResetBusy = () => action(types.GETH_RESET_BUSY);
export const gethResumeSync = () => action(types.GETH_RESUME_SYNC);
export const gethStart = () => action(types.GETH_START);

export const gethStartError = (data, error) => {
    if (typeof error !== 'object') {
        error = { message: error };
    }
    error.code = 'GSE01';
    error.messageId = 'gethStart';
    return action(types.GETH_START_ERROR, { data, error });
};

export const gethStartLogger = () => action(types.GETH_START_LOGGER);
export const gethStartSuccess = (data, services) =>
    action(types.GETH_START_SUCCESS, { data, services });
export const gethStop = () => action(types.GETH_STOP);

export const gethStopError = (error) => {
    error.code = 'GSTE01';
    error.messageId = 'gethStop';
    return action(types.GETH_STOP_ERROR, { error });
};

export const gethStopLogger = () => action(types.GETH_STOP_LOGGER);
export const gethStopSuccess = (data, services) =>
    action(types.GETH_STOP_SUCCESS, { data, services });
export const gethStopSync = () => action(types.GETH_STOP_SYNC);

export const ipfsGetConfigError = (error) => {
    error.code = 'IGCE01';
    error.messageId = 'ipfsGetConfig';
    return action(types.IPFS_GET_CONFIG_ERROR, { error });
};

export const ipfsGetConfigSuccess = data => action(types.IPFS_GET_CONFIG_SUCCESS, { data });
export const ipfsGetLogs = () => action(types.IPFS_GET_LOGS);
export const ipfsGetLogsSuccess = data => action(types.IPFS_GET_LOGS_SUCCESS, { data });
export const ipfsGetPorts = () => action(types.IPFS_GET_PORTS);

export const ipfsGetPortsError = (error) => {
    error.code = 'IGPE01';
    error.messageId = 'ipfsGetPorts';
    return action(types.IPFS_GET_PORTS_ERROR, { error });
};

export const ipfsGetPortsSuccess = (data, services) =>
    action(types.IPFS_GET_PORTS_SUCCESS, { data, services });
export const ipfsGetStatus = () => action(types.IPFS_GET_STATUS);

export const ipfsGetStatusError = (error) => {
    error.code = 'IGSE01';
    error.messageId = 'ipfsGetStatus';
    return action(types.IPFS_GET_STATUS_ERROR, { error });
};

export const ipfsGetStatusSuccess = (data, services) =>
    action(types.IPFS_GET_STATUS_SUCCESS, { data, services });
export const ipfsResetBusy = () => action(types.IPFS_RESET_BUSY);
export const ipfsResetPorts = () => action(types.IPFS_RESET_PORTS);
export const ipfsSetPorts = ports => action(types.IPFS_SET_PORTS, { ports });

export const ipfsSetPortsError = (error) => {
    error.code = 'ISPE01';
    error.messageId = 'ipfsSetPorts';
    return action(types.IPFS_SET_PORTS_ERROR, { error });
};

export const ipfsSetPortsSuccess = data => action(types.IPFS_SET_PORTS_SUCCESS, { data });
export const ipfsStart = () => action(types.IPFS_START);

export const ipfsStartError = (data, error) => {
    error.code = 'ISE01';
    error.messageId = 'ipfsStart';
    return action(types.IPFS_START_ERROR, { data, error });
};

export const ipfsStartLogger = () => action(types.IPFS_START_LOGGER);
export const ipfsStartSuccess = (data, services) =>
    action(types.IPFS_START_SUCCESS, { data, services });
export const ipfsStop = () => action(types.IPFS_STOP);

export const ipfsStopError = (error) => {
    error.code = 'ISTE01';
    error.messageId = 'ipfsStopError';
    return action(types.IPFS_STOP_ERROR, { error });
};

export const ipfsStopLogger = () => action(types.IPFS_STOP_LOGGER);
export const ipfsStopSuccess = (data, services) =>
    action(types.IPFS_STOP_SUCCESS, { data, services });
export const servicesSetTimestamp = timestamp =>
    action(types.SERVICES_SET_TIMESTAMP, { timestamp });
