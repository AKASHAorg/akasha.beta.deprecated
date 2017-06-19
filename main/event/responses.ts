import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { BASE_URL, generalSettings } from '../config/settings';
/**
 *
 * @param rawData
 * @param request
 * @returns {any}
 */
export const mainResponse = (rawData: any, request: any): MainResponse => {
    if (rawData.error) {
        return {
            data: {},
            services: {
                ipfs: Object.assign(IpfsConnector.getInstance().serviceStatus,
                    { [BASE_URL]: generalSettings.get(BASE_URL) }),
                geth: GethConnector.getInstance().serviceStatus
            },
            error: rawData.error, request
        };
    }
    return {
        data: rawData,
        services: {
            ipfs: Object.assign(IpfsConnector.getInstance().serviceStatus,
                { [BASE_URL]: generalSettings.get(BASE_URL) }),
            geth: GethConnector.getInstance().serviceStatus
        }, request
    };
};
