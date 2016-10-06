import debug from 'debug';
import BaseService from './base-service';
import profileDB from './db/profile';

const Channel = window.Channel;
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
     * create a new profile
     * Request:
     * @param <object> {
     *      token: String;
     *      username: string;
     *      ipfs: IpfsProfileCreateRequest;
     *      gas?: number;
     * }
     * Response:
     * @param data = { tx: string }
     */
    registerProfile = ({ token, username, ipfs, gas = 1000000, onError, onSuccess }) => {
        const serverChannel = Channel.server.registry.registerProfile;
        const clientChannel = Channel.client.registry.registerProfile;

        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(onError, onSuccess)
    }, () => serverChannel.send({ token, username, ipfs, gas }));
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
                serverChannel.send({})
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
                serverChannel.send({ ethAddress })
            );
        });
    }

    /**
     * Create a temporary profile in indexedDB
     * @param {object} profileData - Data of the profile created
     * @param {object} currentStatus - Current status of the profile creation process
     */
    createTempProfile = ({ profileData, currentStatus, onSuccess, onError }) =>
        profileDB.transaction('rw', profileDB.tempProfile, () => {
            dbg('createTempProfile', { ...profileData, currentStatus });
            return profileDB.tempProfile.add({
                ...profileData,
                currentStatus
            });
        }).then((data) => {
            dbg('temp profile created!', data);
            onSuccess(data);
        }).catch(reason => onError(reason));
    /**
     * Update temporary profile in indexedDB
     * @param {string} username
     * @param {object} changes - Contains data of the updated profile
     * @return promise
     */
    updateTempProfile = ({ changes, onSuccess, onError }) =>
        profileDB.transaction('rw', profileDB.tempProfile, () => {
            return profileDB.tempProfile.toArray().then((tmpProfile) => {
                dbg('updating', tmpProfile, changes);
                return profileDB.tempProfile.update(tmpProfile[0].username, changes);
            }).then((data) => {
                dbg('updated temp profile', data);
                onSuccess(data);
            });
        })
        .catch(reason => onError(reason));
    /**
     * Delete temporary profile. Called after profile was successfully created
     */
    deleteTempProfile = ({ onSuccess, onError }) =>
        profileDB.tempProfile.clear();
    /**
     * Get all available temporary profiles
     * @return promise
     */
    getTempProfile = ({ onError = () => {}, onSuccess }) => {
        profileDB.transaction('rw', profileDB.tempProfile, () =>
            profileDB.tempProfile.toArray()
        ).then((results) => {
            dbg('temp profiles: ', results);
            onSuccess(results[0]);
        }).catch(reason => onError(reason));
    }
}

export { RegistryService };
