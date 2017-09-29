import profileDB from './db/profile';

export const profileDeleteLogged = () =>
    new Promise((resolve, reject) =>
        profileDB.loggedProfile
            .clear()
            .then(() => resolve())
            .catch(error => reject(error))
    );

export const profileGetLogged = () =>
    new Promise((resolve, reject) =>
        profileDB.loggedProfile
            .toArray()
            .then(data => resolve(data[0] || {}))
            .catch(error => reject(error))
    );

export const profileGetSuggestions = akashaId =>
    new Promise((resolve, reject) =>
        profileDB.knownAkashaIds
            .filter(item => item.akashaId.includes(akashaId))
            .toArray()
            .then(data => resolve(data.slice(0, 5).map(item => item.akashaId)))
            .catch(err => reject(err))
    );

export const profileSaveAkashaIds = akashaIds =>
    profileDB.knownAkashaIds
        .bulkPut(akashaIds.map(akashaId => ({ akashaId })));

export const profileSaveLogged = profile =>
    profileDB.loggedProfile.clear()
        .then(() => profileDB.loggedProfile.put(profile));

export const profileUpdateLogged = profile =>
    new Promise((resolve, reject) =>
        profileDB.loggedProfile
            .put(profile)
            .then(resolve)
            .catch(reject)
    );

export const tempProfileGet = () =>
    new Promise((resolve, reject) =>
        profileDB.tempProfileGet
            .toArray()
            .then(data => resolve(data[0] || {}))
            .catch(error => reject(error))
    );

export const tempProfileSave = tempProfile =>
    new Promise((resolve, reject) =>
        profileDB.tempProfileGet
            .put(tempProfile)
            .then(resolve)
            .catch(reject)
    );
