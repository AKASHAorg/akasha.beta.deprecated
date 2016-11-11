import BaseService from './base-service';
import profileDB from './db/profile';

const Channel = window.Channel;
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
     *      akashaId: string;
     *      ipfs: IpfsProfileCreateRequest;
     *      gas?: number;
     * }
     * Response:
     * @param data = { tx: string }
     */
    registerProfile = ({ token, akashaId, ipfs, gas = 2000000, onError, onSuccess }) => {
        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel: Channel.server.registry.registerProfile,
            clientChannel: Channel.client.registry.registerProfile,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                Channel.client.registry.registerProfile.channelName
            )
        }, () => {
            Channel.server.registry.registerProfile.send({ token, akashaId, ipfs, gas });
        });
    };
    /**
     * Get eth address of the logged profile
     * Request: {}
     * Response:
     * @param data = {ethAddress: String}
     */
    getCurrentProfile = ({ onError, onSuccess }) => {
        this.registerListener(
            Channel.client.registry.getCurrentProfile,
            this.createListener(onError, onSuccess)
        );
        Channel.server.registry.getCurrentProfile.send({});
    };
    /**
     * return contract address for a given eth address
     * Request:
     *  @param ethAddress <String> eth address
     * Response:
     *  @param data = { profileAddress: String } -> profile contract address
     */
    getByAddress = ({ ethAddress, onSuccess, onError }) => {
        this.registerListener(
            Channel.client.registry.getByAddress,
            this.createListener(onError, onSuccess)
        );
        Channel.server.registry.getByAddress.send(ethAddress);
    }

    /**
     * Create a temporary profile in indexedDB
     * @param {object} profileData - Data of the profile created
     * @param {object} currentStatus - Current status of the profile creation process
     */
    createTempProfile = ({ profileData, currentStatus, onSuccess, onError }) =>
        profileDB.transaction('rw', profileDB.tempProfile, () =>
            profileDB.tempProfile.add({
                ...profileData,
                currentStatus
            })
        ).then((data) => {
            onSuccess(data);
        }).catch(reason => onError(reason));
    /**
     * Update temporary profile in indexedDB
     * @param {string} akashaId
     * @param {object} changes - Contains data of the updated profile
     * @return promise
     */
    updateTempProfile = ({ changes, currentStatus, onSuccess, onError }) =>
        profileDB.transaction('rw', profileDB.tempProfile, () =>
            profileDB.tempProfile.toArray().then(tmpProfile =>
                profileDB.tempProfile.update(tmpProfile[0].akashaId, {
                    ...changes,
                    currentStatus
                })
            ).then(() => {
                onSuccess({ ...changes, currentStatus });
            })
        )
        .catch(reason => onError(reason));
    /**
     * Delete temporary profile. Called after profile was successfully created
     */
    deleteTempProfile = ({ akashaId, onSuccess, onError }) =>
        profileDB.transaction('rw', profileDB.tempProfile, () => {
            profileDB.tempProfile.delete(akashaId);
        })
        .then(() => onSuccess())
        .catch(reason => onError(reason));

    /**
     * Get all available temporary profiles
     * @return promise
     */
    getTempProfile = ({ onError = () => {}, onSuccess }) => {
        profileDB.transaction('rw', profileDB.tempProfile, () =>
            profileDB.tempProfile.toArray()
        ).then((results) => {
            onSuccess(results[0]);
        }).catch((reason) => {
            onError(reason);
        });
    }
}

export { RegistryService };
