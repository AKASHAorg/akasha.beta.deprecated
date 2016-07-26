import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

/**
 *
 * @param data
 * @param error
 * @returns {{data: GethStatus, error: {message: string, fatal?: boolean}}}
 */
export const gethResponse = (data: Object, error?: {message: string, fatal?: boolean}): MainResponse => {
    const api = GethConnector.getInstance().serviceStatus;
    const status: GethStatus = Object.assign(data, { api: api.api, spawned: api.process });
    return { data: status, error };
};

export const ipfsResponse = (data: Object, error?: {message: string, fatal?: boolean}): MainResponse => {
    const status = IpfsConnector.getInstance().serviceStatus;
    const merged: IpfsStatus = Object.assign(data, {api: status.api, spawned: status.process});
    return {data: merged, error};
};
