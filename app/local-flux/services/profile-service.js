import { ipcRenderer } from 'electron';
import { EVENTS } from '../../../electron-api/modules/settings';
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

    getProfileData = (ipfsHashArray, cb) => {
        const clientChannel = EVENTS.client.user.getProfileData;
        if (typeof this.listeners[clientChannel] === 'function') {
            return;
        }
        this.listeners[clientChannel] = (ev, data) => {
            if (!data.success) {
                return cb(data.status.error);
            }
            return cb(null, data);
        };

        ipcRenderer.on(clientChannel, this.listeners[clientChannel]);

        for (let i = ipfsHashArray.length - 1; i >= 0; i--) {
            ipcRenderer.send(EVENTS.server.user.getProfileData, { ipfsHash: ipfsHashArray[i] });
        }
    }

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
            const account = profileData.address;
            const password = profileData.password;
            ipcRenderer.send(EVENTS.server.user.login, { account, password });
        });
    logout = (account) =>
        new Promise((resolve, reject) => {

            // ipcRenderer.once(EVENTS.client.user.logout, (ev, data) => {
            //     if (!data) {
            //         const err = new Error('Main process can`t handle requests!');
            //         return reject(err);
            //     }
            //     return resolve(data);
            // });
            ipcRenderer.send(EVENTS.server.user.logout, { account });
            return resolve();
        });
    /**
     * Save logged profile to indexedDB database.
     * @param profileData {object}
     */
    saveLoggedProfile = (profileData) =>
        profileDB.transaction('rw', profileDB.loggedProfile, () => {
            dbg('saving logged profile', profileData);
            if (profileData.password) {
                delete profileData.password;
            }
            return profileDB.loggedProfile.add({
                ...profileData
            });
        });
    /**
     * Destroy logged profile from db
     */
    removeLoggedProfile = () =>
        profileDB.loggedProfile.clear();
    /**
     * Get logged profile from indexedDB
     */
    getLoggedProfile = () =>
        profileDB.transaction('r', profileDB.loggedProfile, () => {
            dbg('getLoggedProfile');
            return profileDB.loggedProfile.toArray();
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
                userName: profileData.get('userName'),
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
