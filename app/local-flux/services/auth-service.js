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
        const serverChannel = Channel.server.auth.login;
        const clientChannel = Channel.client.auth.login;
        const successCb = (data) => {
            profileDB.transaction('rw', profileDB.loggedProfile, () => {
                profileDB.loggedProfile.add(data);
                return data;
            }).then((loggedProfile) => {
                onSuccess(loggedProfile);
            }).catch(error => onError(error));
        };
        this.registerListener(
            clientChannel,
            this.createListener(onError, successCb, clientChannel.channelName)
        );
        serverChannel.send({ account, password, rememberTime });
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
        const serverChannel = Channel.server.auth.logout;
        const clientChannel = Channel.client.auth.logout;
        const successCb = () => {
            this.deleteLoggedProfile(options.profileKey).then(() => {
                onSuccess();
            }).catch(error => onError(error));
        };
        this.registerListener(
            clientChannel,
            this.createListener(onError, successCb, clientChannel.channelName)
        );
        serverChannel.send({});
    };
    /**
     * Sends a request to faucet
     * Request:
     * @param {string} profileAddress
     * Response:
     * @param data: { tx: String }
     */
    requestEther = ({ address, onSuccess, onError }) => {
        const serverChannel = Channel.server.auth.requestEther;
        const clientChannel = Channel.client.auth.requestEther;
        const successCb = (data) => {
            if (data === 'Unauthorized' || data === 'Bad Request') {
                return onError({ message: data, fatal: true });
            }
            return onSuccess(data);
        };
        this.registerListener(
            clientChannel,
            this.createListener(onError, successCb, clientChannel.channelName)
        );
        serverChannel.send({ address });
    };
    /**
     * Create a new eth address
     * @param {Uint8Array} profilePassword - user chosen password
     * @return new Promise
     */
    createEthAddress = ({ password, onSuccess, onError }) => {
        const serverChannel = Channel.server.auth.generateEthKey;
        const clientChannel = Channel.client.auth.generateEthKey;

        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            serverChannel.send({ password });
        });
    };
    /**
     * Get a list of local profiles created
     */
    getLocalIdentities = ({ options = {}, onError = () => {}, onSuccess }) => {
        const serverChannel = Channel.server.auth.getLocalIdentities;
        const clientChannel = Channel.client.auth.getLocalIdentities;

        return this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(onError, onSuccess, clientChannel.channelName)
        }, () =>
            serverChannel.send(options)
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
