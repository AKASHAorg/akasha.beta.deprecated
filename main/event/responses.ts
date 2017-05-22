import { GethConnector } from '@akashaproject/geth-connector';
import { IpfsConnector } from '@akashaproject/ipfs-connector';
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
                ipfs: IpfsConnector.getInstance().serviceStatus,
                geth: GethConnector.getInstance().serviceStatus
            },
            error: rawData.error, request
        };
    }
    return {
        data: rawData,
        services: {
            ipfs: IpfsConnector.getInstance().serviceStatus,
            geth: GethConnector.getInstance().serviceStatus
        }, request
    };
};
