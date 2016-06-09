const { ipcRenderer } = require('electron');
import { EVENTS } from '../../electron-api/modules/settings';
import profileDB from './db/profile';

export function validateUsername (username) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send(EVENTS.server.profile.verifyUsername, username);
        ipcRenderer.on(EVENTS.client.profile.verifyUsername, (ev, data) => {
            if (!data) {
                return reject('OMG!! Main process doesn`t want to communicate with us!');
            }
            return resolve(data);
        });
    });
}

export function createProfile (profileData) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send(EVENTS.server.profile.create, profileData);
        ipcRenderer.on(EVENTS.client.profile.create, (ev, data) => {
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
}

export function updateProfile (userData) {}
