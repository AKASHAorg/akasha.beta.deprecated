import { GethConnector } from '@akashaproject/geth-connector';

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
