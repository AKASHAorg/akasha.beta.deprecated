import { ipcRenderer } from 'electron';
import { EVENTS } from '../../electron-api/modules/settings';
import profileDB from './db/profile';

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
            return resolve([
                {
                    userName: '@severs',
                    firstName: 'Sever',
                    lastName: 'Abibula',
                    avatar: '',
                    address: '0xe1d10c20b12a321'
                },
                {
                    userName: '@atrulylongusernamefortesting',
                    firstName: 'SomeLongUserFirstname',
                    lastName: 'SomeLongUserLastname',
                    avatar: '',
                    address: '0xe1d10c20b12a322'
                }
            ]);
            // ipcRenderer.send(EVENTS.server.profile.list);
            // ipcRenderer.once(EVENTS.client.profile.list, (ev, data) => {
            //     if (!data) {
            //         const err = new Error('Main Process down!');
            //         return reject(err);
            //     }
            //     return resolve(data);
            // });
        });
    saveTempProfile = (profileData, currentStep) =>
        profileDB.transaction('rw', profileDB.newProfile, () => {
            profileDB.newProfile.put({
                name: 'newProfile',
                profileData,
                currentStep
            });
        });

    clearTempProfile = () =>
        profileDB.newProfile.delete();

    getTempProfile = () =>
        profileDB.transaction('r', profileDB.newProfile, () =>
            profileDB.newProfile.toArray());

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
    fundFromFaucet = (profileAddress) =>
        new Promise((resolve, reject) => {
            ipcRenderer.one(EVENTS.client.user.faucet, (ev, data) => {
                if (!data) {
                    const error = new Error('Main process did not return anything!');
                    return reject(error);
                }
                return resolve(data);
            });
            ipcRenderer.send(EVENTS.client.user.faucet, profileAddress);
        })
    createProfile = (profileData) => {}
        // new Promise((resolve, reject) => {
        //     ipcRenderer.send(EVENTS.server.profile.create, profileData);
        //     ipcRenderer.once(EVENTS.client.profile.create, (ev, data) => {
        //         if (!data) {
        //             return reject('Ouch! Main process cannot communicate with us!');
        //         }
        //         // save profile to indexedDB
        //         // index by address?
        //         return profileDB.transaction('rw', profileDB.localProfiles, async() =>
        //             resolve(await profileDB.localProfiles.add({ data }))
        //         ).catch(err => reject(err));
        //     });
        // });
    updateProfile = () => {}
}

export { ProfileService };
