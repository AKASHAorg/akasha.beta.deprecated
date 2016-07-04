import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';
import profileDB from './db/profile';
import debug from 'debug';
const dbg = debug('App:ProfileService:');
/**
 * Profile Service for communicating with main process.
 */
class ProfileService {
    constructor () {
        this.listeners = {};
    }
    removeListener (channel) {
        ipcRenderer.removeListener(channel, this.listeners[channel]);
    }
    /**
     * Validate username on blockchain
     */
    validateUsername = (username) =>
        new Promise((resolve, reject) => {
            ipcRenderer.send(EVENTS.server.profile.verifyUsername, username);
            ipcRenderer.once(EVENTS.client.profile.verifyUsername, (ev, data) => {
                if (!data) {
                    return reject('OMG!! Main process doesn`t want to communicate with us!');
                }
                return resolve(data);
            });
        });
    /**
     * Get a list of local profiles created
     */
    getProfilesList = () =>
        new Promise((resolve, reject) => {
            ipcRenderer.once(EVENTS.client.user.listEthAccounts, (ev, data) => {
                if (!data) {
                    const err = new Error('Main Process down!');
                    return reject(err);
                }
                dbg('getProfilesList_Success', data);
                return resolve(data);
            });
            dbg('getProfilesList_Start', EVENTS.server.user.listEthAccounts);
            ipcRenderer.send(EVENTS.server.user.listEthAccounts);
        });
    login = (profileData) =>
        new Promise((resolve, reject) => {
            ipcRenderer.once(EVENTS.client.user.login, (ev, data) => {
                if (!data) {
                    const err = new Error('Main process down!');
                    return reject(err);
                }
                dbg('logging in', data);
                return resolve(data);
            });
            const account = profileData.ethAddress;
            const password = profileData.password;
            ipcRenderer.send(EVENTS.server.user.login, { account, password });
        });
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
        )
    /**
     * Get ballance for a profile
     * @param {string} profileAddress
     * @return new Promise
     */
    getProfileBalance = (profileAddress) =>
        new Promise((resolve, reject) => {
            ipcRenderer.once(EVENTS.client.user.getBalance, (ev, data) => {
                if (!data) {
                    const error = new Error('Main process malfunction');
                    return reject(error);
                }
                return resolve(data);
            });
            ipcRenderer.send(EVENTS.server.user.getBalance, { account: profileAddress });
        });
    /**
     * Create a new eth address
     * @param {string} profilePassword - user chosen password
     * @return new Promise
     */
    createEthAddress = (profilePassword) =>
        new Promise((resolve, reject) => {
            ipcRenderer.once(EVENTS.client.user.createCoinbase, (ev, data) => {
                if (!data) {
                    const error = new Error('Main process silenced...');
                    return reject(error);
                }
                return resolve(data);
            });
            ipcRenderer.send(EVENTS.server.user.createCoinbase, { password: profilePassword });
        });
    /**
     * Step 2 in profile creation process. Sends a request to faucet
     * @param {string} profileAddress
     * @return new Promise
     */
    requestFundFromFaucet = (profileAddress) =>
        new Promise((resolve, reject) => {
            ipcRenderer.once(EVENTS.client.user.faucetRequestEther, (ev, data) => {
                if (!data) {
                    const error = new Error('Main process did not return anything!');
                    return reject(error);
                }
                return resolve(data);
            });
            ipcRenderer.send(EVENTS.server.user.faucetEther, { account: profileAddress });
        });
    /**
     * Step 3 in profile creation process. Checks if balance is > 0 and if not
     * waits for a confirmation that address received funds.
     * @param {string} profileAddress
     */
    fundFromFaucet = (profileAddress) =>
        new Promise((resolve, reject) => {
            this.getProfileBalance(profileAddress).then(balance => {
                dbg('Current balance: ', balance);
                if (balance.status === 0) {
                    ipcRenderer.once(EVENTS.client.user.faucetEther, (ev, data) => {
                        if (!data) {
                            const error = new Error('Main process did not return anything!');
                            return reject(error);
                        }
                        return resolve(data);
                    });
                } else {
                    return resolve(balance);
                }
            });
        });
    /**
     * Step 4 in profile creation process (last step). Sends profile data to main process
     * @param {object} profileData
     * return new Promise
     */
    completeProfileCreation = (profileData) =>
        new Promise((resolve, reject) => {
            ipcRenderer.once(EVENTS.client.user.registerProfileComplete, (ev, data) => {
                if (!data) {
                    const error = new Error('Main process did not return anything!');
                    return reject(error);
                }
                dbg('completeProfileCreation ', data);
                return resolve(data);
            });
            const data = {
                account: profileData.get('address'),
                firstName: profileData.get('firstName'),
                lastName: profileData.get('lastName'),
                username: profileData.get('userName'),
                password: profileData.get('password'),
                optionalData: profileData.get('optionalData')
            };
            dbg('completeProfileCreation_Start', data);
            ipcRenderer.send(EVENTS.server.user.registerProfile, data);
        });
    /**
     * Perform updates to a profile
     * @param {object} newProfile
     * @return new Promise
     */
    updateProfile = () => {}
}

export { ProfileService };
