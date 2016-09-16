import { ipcRenderer } from 'electron';
import BaseService from './base-service';
import profileDB from './db/profile';
import debug from 'debug';

const Channel = window.Channel;
const dbg = debug('App:ProfileService:');
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
    getProfileBalance = (profileAddress, unit = 'ether') => {
        const serverChannel = Channel.server.profile.getMyBalance;
        const clientChannel = Channel.client.profile.getMyBalance;
        if (this._listeners.has(clientChannel)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, { profile: profileAddress, unit })
            );
        });
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
    getProfileData = (profile, full = false) => {
        const serverChannel = Channel.server.profile.getProfileData;
        const clientChannel = Channel.client.profile.getProfileData;
        if (this._listeners.has(clientChannel)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, { profile, full })
            );
        });
    };
    /**
     * retrieve profile data by ipfs address
     * Request:
     * @param ipfsHash <String> ipfs profile hash
     * @param full <Boolean> (optional) resolve full profile
     * Response:
     * same as `getProfileData`
     */
    getIpfs = (ipfsHash, full = false) => {
        const serverChannel = Channel.server.profile.getIpfs;
        const clientChannel = Channel.server.profile.getIpfs;
        if (this._listeners.has(clientChannel)) return Promise.resolve();
        return new Promise ((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, { ipfsHash, full })
            );
        });
    };
    /**
     * unregister profile -> delete profile from profiles registry contract
     * @todo gather more info and implement!
     */
    unregister = () => {};
}

export { ProfileService };
