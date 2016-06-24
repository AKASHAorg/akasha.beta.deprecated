import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';
import profileDB from './db/profile';
import debug from 'debug';
const dbg = debug('App:ProfileService:');

class ProfileService {
    constructor () {
        this.listeners = {};
    }
    removeListener (channel) {
        ipcRenderer.removeListener(channel, this.listeners[channel]);
    }
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
    getProfilesList = () =>
        new Promise((resolve, reject) => {
            // return resolve([
            //     {
            //         userName: '@severs',
            //         firstName: 'Sever',
            //         lastName: 'Abibula',
            //         avatar: '',
            //         address: '0xe1d10c20b12a321'
            //     },
            //     {
            //         userName: '@atrulylongusernamefortesting',
            //         firstName: 'SomeLongUserFirstname',
            //         lastName: 'SomeLongUserLastname',
            //         avatar: '',
            //         address: '0xe1d10c20b12a322'
            //     }
            // ]);
            ipcRenderer.once(EVENTS.client.user.listAccounts, (ev, data) => {
                if (!data) {
                    const err = new Error('Main Process down!');
                    return reject(err);
                }
                dbg('getProfilesList_Success', data);
                return resolve(data);
            });
            dbg('getProfilesList_Start', EVENTS.server.user.listAccounts);
            ipcRenderer.send(EVENTS.server.user.listAccounts);
        });
    saveTempProfile = (profileData, currentStatus) =>
        profileDB.transaction('rw', profileDB.tempProfile, () => {
            const { userName, firstName, lastName, password, password2 } = profileData;
            const optionalData = {
                avatarFile: profileData.avatarFile,
                backgroundImage: profileData.backgroundImage,
                aboutMe: profileData.aboutMe,
                links: profileData.links
            };
            dbg('saveTempProfile(put)', profileData, optionalData);
            return profileDB.tempProfile.put({
                userName,
                firstName,
                lastName,
                password,
                password2,
                optionalData,
                currentStatus
            });
        });

    updateTempProfile = (userName, changes) =>
        profileDB.transaction('rw', profileDB.tempProfile, () => {
            dbg('updateTempProfile(update)', userName, { ...changes });
            return profileDB.tempProfile.update(userName, { ...changes });
        });

    clearTempProfile = () =>
        profileDB.tempProfile.delete();

    getTempProfile = () =>
        profileDB.transaction('r', profileDB.tempProfile, () =>
            profileDB.tempProfile.toArray()
        )

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
    requestFundFromFaucet = (profileAddress) =>
        new Promise((resolve, reject) => {
            
            // ipcRenderer.once(EVENTS.client.user.faucetRequestEther, (ev, data) => {
            //     if (!data) {
            //         const error = new Error('Main process did not return anything!');
            //         return reject(error);
            //     }
            //     return resolve(data);
            // });
            ipcRenderer.send(EVENTS.server.user.faucetEther, { account: profileAddress });
            return resolve({});
        });
    fundFromFaucet = (profileAddress) =>
        new Promise((resolve, reject) => {
            ipcRenderer.once(EVENTS.client.user.faucetEther, (ev, data) => {
                if (!data) {
                    const error = new Error('Main process did not return anything!');
                    return reject(error);
                }
                return resolve(data);
            });
        });
    completeProfileCreation = (profileData) =>
        new Promise((resolve, reject) => {
            ipcRenderer.once(EVENTS.client.user.signUp, (ev, data) => {
                if (!data) {
                    const error = new Error('Main process did not return anything!');
                    return reject(error);
                }
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
            ipcRenderer.send(EVENTS.server.user.signUp, data);
        })
    updateProfile = () => {}
}

export { ProfileService };
