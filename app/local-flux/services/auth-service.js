import BaseService from './base-service';
import profileDB from './db/profile';

const Channel = window.Channel;
/**
 * Auth Service.
 * default open channels => ['login', 'logout', 'requestEther']
 * available channels =>
 * ['manager', 'login', 'logout', 'requestEther', 'generateEthKey', 'getLocalIdentities']
 */
class AuthService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.auth.manager;
        this.clientManager = Channel.client.auth.manager;
    }
    /**
     * Login profile in AKASHA
     * Request:
     * @param profile.account <String> Eth address of the profile
     * @param profile.password <Uint8Array> The password
     * @param rememberTime <Number> number of minutes to remember
     * Response:
     * @param data = {
     *      token: String -> must be used for the duration of rememberTime
     *      expiration: Date -> expiration time of the token
     * }
     */
    login = ({ account, password, rememberTime, onSuccess, onError }) => {
        const successCb = (data) => {
            profileDB.transaction('rw', profileDB.loggedProfile, () => {
                profileDB.loggedProfile.add(data);
                return data;
            }).then((loggedProfile) => {
                onSuccess(loggedProfile);
            }).catch(error => onError(error));
        };
        this.registerListener(
            Channel.client.auth.login,
            this.createListener(onError, successCb)
        );
        Channel.server.auth.login.send({ account, password, rememberTime });
    };
    /**
     *  Logout profile
     * @request flush <Boolean>
     * @response data: {
     *      done: Boolean
     * }
     * @param options.flush <Boolean>
     * @param options.profileKey <String> Eth key
     */
    logout = ({ options = { profileKey: '', flush: true }, onError, onSuccess }) => {
        const successCb = () => {
            this.deleteLoggedProfile(options.profileKey).then(() => {
                onSuccess();
            }).catch(error => onError(error));
        };
        this.registerListener(
            Channel.client.auth.logout,
            this.createListener(onError, successCb)
        );
        Channel.server.auth.logout.send({});
    };
    /**
     * Sends a request to faucet
     * Request:
     * @param {string} profileAddress
     * Response:
     * @param data: { tx: String }
     */
    requestEther = ({ address, onSuccess, onError }) => {
        const successCb = (data) => {
            if (data === 'Unauthorized' || data === 'Bad Request') {
                return onError({ message: data, fatal: true });
            }
            return onSuccess(data);
        };
        this.registerListener(
            Channel.client.auth.requestEther,
            this.createListener(onError, successCb)
        );
        Channel.server.auth.requestEther.send({ address });
    };
    /**
     * Create a new eth address
     * @param {Uint8Array} profilePassword - user chosen password
     * @return new Promise
     */
    createEthAddress = ({ password, onSuccess, onError }) => {
        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel: Channel.server.auth.generateEthKey,
            clientChannel: Channel.client.auth.generateEthKey,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.auth.generateEthKey.send({ password });
        });
    };
    /**
     * Get a list of local profiles created
     */
    getLocalIdentities = ({ options = {}, onError = () => {}, onSuccess }) => {
        return this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel: Channel.server.auth.getLocalIdentities,
            clientChannel: Channel.client.auth.getLocalIdentities,
            listenerCb: this.createListener(onError, onSuccess)
        }, () =>
            Channel.server.auth.getLocalIdentities.send(options)
        );
    };
    /**
     * Save logged profile to indexedDB database.
     * @param profileData {object}
     */
    createLoggedProfile = ({ profileData, onSuccess, onError }) =>
        profileDB.transaction('rw', profileDB.loggedProfile, () => {
            if (profileData.password) {
                delete profileData.password;
            }
            return profileDB.loggedProfile.add(profileData);
        })
        .then(() => onSuccess(profileData))
        .catch(reason => onError(reason));

    deleteLoggedProfile = ({ profileKey, onError, onSuccess }) =>
        profileDB.transaction('rw', profileDB.loggedProfile, () => {
            if (profileKey) return profileDB.loggedProfile.delete(profileKey);
            return profileDB.loggedProfile.clear();
        })
        .then(() => onSuccess())
        .catch(reason => onError(reason));

    getLoggedProfile = ({ onError, onSuccess }) =>
        profileDB.transaction('r', profileDB.loggedProfile, () =>
            profileDB.loggedProfile.toArray()
        ).then(profile => onSuccess(profile[0]))
        .catch(reason => onError(reason));
}

export { AuthService };
