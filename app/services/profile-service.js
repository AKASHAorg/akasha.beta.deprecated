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
    createProfile = (profileData) =>
        new Promise((resolve, reject) => {
            ipcRenderer.send(EVENTS.server.profile.create, profileData);
            ipcRenderer.once(EVENTS.client.profile.create, (ev, data) => {
                if (!data) {
                    return reject('Ouch! Main process cannot communicate with us!');
                }
                // save profile to indexedDB
                // index by address?
                return profileDB.transaction('rw', profileDB.localProfiles, async() =>
                    resolve(await profileDB.localProfiles.add({ data }))
                ).catch(err => reject(err));
            });
        });
    updateProfile = () => {}
}

export { ProfileService };
