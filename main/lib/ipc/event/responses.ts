import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';

/**
 *
 * @param data
 * @param request
 * @param error
 * @returns {{data: GethStatus, request: any, error: {message: string, fatal?: boolean}}}
 */
export const gethResponse = (data: Object, request: any, error?: { message: string, fatal?: boolean }): MainResponse => {
    const api = GethConnector.getInstance().serviceStatus;
    const status: GethStatus = Object.assign(data, { api: api.api, spawned: api.process });
    return { data: status, request, error };
};

/**
 *
 * @param data
 * @param request
 * @param error
 * @returns {{data: IpfsStatus, request: any, error: {message: string, fatal?: boolean, from?: {}}}}
 */
export const ipfsResponse = (data: Object, request: any, error?: { message: string, fatal?: boolean, from?: {} }): MainResponse => {
    const status = IpfsConnector.getInstance().serviceStatus;
    const merged: IpfsStatus = Object.assign(data, { api: status.api, spawned: status.process });
    return { data: merged, request, error };
};

/**
 *
 * @param rawData
 * @param request
 * @returns {any}
 */
export const mainResponse = (rawData: any, request: any): MainResponse => {
    if (rawData.error) {
        return { data: {}, error: { message: rawData.error.message }, request };
    }
    return { data: rawData, request };
};
