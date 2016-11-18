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

/**
 *
 * @param data
 * @param error
 * @returns {{data: IpfsStatus, error: {message: string, fatal?: boolean}}}
 */
export const ipfsResponse = (data: Object, error?: {message: string, fatal?: boolean, from?: {}}): MainResponse => {
    const status = IpfsConnector.getInstance().serviceStatus;
    const merged: IpfsStatus = Object.assign(data, { api: status.api, spawned: status.process });
    return { data: merged, error };
};

/**
 *
 * @param rawData
 * @returns {any}
 */
export const mainResponse = (rawData: any): MainResponse => {
    if (rawData.error) {
        return { data: {}, error: { message: rawData.error.message, from: rawData.from } };
    }
    return { data: rawData };
};
