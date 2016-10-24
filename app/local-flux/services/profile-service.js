import BaseService from './base-service';

const Channel = window.Channel;
/**
 * Profile Service.
 * default open channels => ['getProfileData', 'getMyBalance', 'getIpfs']
 * available channels => ['manager', 'getProfileData', 'getMyBalance', 'getIpfs', 'unregister']
 */
class ProfileService extends BaseService {

    /**
     * Get ballance for a profile
     * Request:
     * @param {string} profileAddress. Optional
     * @param {string} unit
     * Response:
     * @param data = {
     *      value: string
     * }
     * @return new Promise
     */
    getProfileBalance = ({ options = { profile: '', unit: 'eth' }, onError = () => {}, onSuccess }) => {
        this.registerListener(
            Channel.client.profile.getMyBalance,
            this.createListener(onError, onSuccess)
        );
        Channel.server.profile.getMyBalance.send(options);
    };
    /**
     * retrieve profile data by eth address
     * Request:
     * @param profile <String> profile contract address
     * @param full <Boolean> (optional) resolve full profile from ipfs
     * Response:
     * @param data = {
     *      firstName: string;
     *      lastName: string;
     *      avatar?: Uint8Array;
     *      backgroundImage?: any;
     *      about?: string;
     *      links?: { title: string, url: string, type: string, id: number }[];
     * }
     */
    getProfileData = ({
        options = { profile: '', full: false }, onError = () => {}, onSuccess
    }) => {
        this.registerListener(
            Channel.client.profile.getProfileData,
            this.createListener(onError, onSuccess)
        );
        Channel.server.profile.getProfileData.send(options);
    };
    /**
     * retrieve profile data by ipfs address
     * Request:
     * @param ipfsHash <String> ipfs profile hash
     * @param full <Boolean> (optional) resolve full profile
     * Response:
     * same as `getProfileData`
     */
    getIpfs = ({
        options = { ipfsHash: '', full: false }, onError = () => {}, onSuccess
    }) => {
        this.registerListener(
            Channel.server.profile.getIpfs,
            this.createListener(onError, onSuccess)
        );
        Channel.server.profile.getIpfs.send(options);
    };
    /**
     * unregister profile -> delete profile from profiles registry contract
     * @todo gather more info and implement!
     */
    unregister = () => {};
}

export { ProfileService };
