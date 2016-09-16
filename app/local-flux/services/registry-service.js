import { ipcRenderer } from 'electron';
import debug from 'debug';
import BaseService from './base-service';
import profileDB from './db/profile';

const dbg = debug('App:RegistryService:');
/**
 * Registry Service.
 * default open channels => ['getCurrentProfile', 'getByAddress']
 * available channels =>
 * ['manager', 'profileExists', 'registerProfile', 'getCurrentProfile', 'getByAddress']
 */
class RegistryService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.registry.manager;
        this.clientManager = Channel.client.registry.manager;
    }
    /**
     * Validate username on blockchain
     * Request:
     * @param username <String>
     * Response:
     * @param data = { username: string, exists: Boolean }
     */
    validateUsername = (username) => {
        const serverChannel = Channel.server.registry.profileExists;
        const clientChannel = Channel.client.registry.profileExists;
        if (this._listeners.has(clientChannel)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.openChannel({
                serverManager: this.serverManager,
                clientManager: this.clientManager,
                serverChannel,
                clientChannel,
                listenerCb
            }, () => ipcRenderer.send(serverChannel, { username }));
        });
    };
    /**
     * create a new profile
     * Request:
     * @param <object> {
     *      username: string;
     *      ipfs: IpfsProfileCreateRequest;
     *      gas?: number;
     * }
     * Response:
     * @param data = { tx: string }
     */
    registerProfile = ({ username, ipfs, gas = 90000 }) => {
        const serverChannel = Channel.server.registry.registerProfile;
        const clientChannel = Channel.client.registry.registerProfile;
        if (this._listeners.has(clientChannel)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.openChannel({
                serverManager: this.serverManager,
                clientManager: this.clientManager,
                serverChannel,
                clientChannel,
                listenerCb
            }, () => ipcRenderer.send(serverChannel, { username, ipfs, gas }));
        });
    };
    /**
     * Get eth address of the logged profile
     * Request: {}
     * Response:
     * @param data = {ethAddress: String}
     */
    getCurrentProfile = () => {
        const serverChannel = Channel.server.registry.getCurrentProfile;
        const clientChannel = Channel.client.registry.getCurrentProfile;
        if (this._listeners.has(clientChannel)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, {})
            );
        });
    };
    /**
     * return contract address for a given eth address
     * Request:
     *  @param ethAddress <String> eth address
     * Response:
     *  @param data = { profileAddress: String } -> profile contract address
     */
    getByAddress = (ethAddress) => {
        const serverChannel = Channel.server.registry.getByAddress;
        const clientChannel = Channel.client.registry.getByAddress;
        if (this._listeners.has(clientChannel)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const listenerCb = (ev, res) => {
                if (res.error) return reject(res.error);
                return resolve(res.data);
            };
            return this.registerListener(clientChannel, listenerCb, () =>
                ipcRenderer.send(serverChannel, { ethAddress })
            );
        });
    }

    /**
     * Create a temporary profile in indexedDB
     * @param {object} profileData - Data of the profile created
     * @param {object} currentStatus - Current status of the profile creation process
     */
    createTempProfile = (profileData, currentStatus) =>
        profileDB.transaction('rw', profileDB.tempProfile, () => {
            dbg('saveTempProfile(add)', profileData);
            return profileDB.tempProfile.add({
                ...profileData,
                currentStatus
            });
        });
    /**
     * Update temporary profile in indexedDB
     * @param {string} userName
     * @param {object} changes - Contains data of the updated profile
     * @return promise
     */
    updateTempProfile = (userName, changes) =>
        profileDB.transaction('rw', profileDB.tempProfile, () => {
            dbg('updateTempProfile(update)', userName, { ...changes });
            return profileDB.tempProfile.update(userName, { ...changes });
        });
    /**
     * Delete temporary profile. Called after profile was successfully created
     */
    deleteTempProfile = () =>
        profileDB.tempProfile.clear();
    /**
     * Get all available temporary profiles
     * @return promise
     */
    getTempProfile = () =>
        profileDB.transaction('r', profileDB.tempProfile, () =>
            profileDB.tempProfile.toArray()
        );
}

export {RegistryService}