import * as types from '../constants';
import { action } from './helpers';
import { GETH_MODULE, IPFS_MODULE } from '@akashaproject/common/constants';

export const clearSyncStatus = () => action(types.CLEAR_SYNC_STATUS);
export const gethGetLogs = () => action(`${GETH_MODULE.logs}`);

export const gethGetStatus = () => action(`${GETH_MODULE.status}`);

export const gethGetSyncStatus = () => action(`${GETH_MODULE.syncStatus}`);


export const gethPauseSync = () => action(types.GETH_PAUSE_SYNC);
export const gethResetBusy = () => action(types.GETH_RESET_BUSY);
export const gethResumeSync = () => action(types.GETH_RESUME_SYNC);

export const gethStart = () => action(`${GETH_MODULE.startService}`);

export const gethStartLogger = () => action(types.GETH_START_LOGGER);

export const gethStop = () => action(`${GETH_MODULE.stop}`);



export const ipfsGetLogs = () => action(`${IPFS_MODULE.logs}`);
export const ipfsGetPorts = () => action(`${IPFS_MODULE.getPorts}`);


export const ipfsGetStatus = () => action(`${IPFS_MODULE.status}`);

export const ipfsResetBusy = () => action(types.IPFS_RESET_BUSY);
export const ipfsResetPorts = () => action(types.IPFS_RESET_PORTS);

export const ipfsSetPorts = (ports, restart) => action(`${IPFS_MODULE.setPorts}`, { ports, restart });

export const ipfsStart = () => action(`${IPFS_MODULE.startService}`);

export const ipfsStartLogger = () => action(types.IPFS_START_LOGGER);

export const ipfsStop = () => action(`${IPFS_MODULE.stopService}`);

export const servicesSetTimestamp = timestamp =>
    action(types.SERVICES_SET_TIMESTAMP, { timestamp });
