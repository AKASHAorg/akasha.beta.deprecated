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

export const profileSaveLastBlockNr = payload =>
    new Promise((resolve, reject) => {
        profileDB.lastBlockNrs.put({ ...payload })
            .then(ethAddress => resolve({ ethAddress }))
            .catch(err => reject(err));
    });
export const profileGetLastBlockNr = ethAddress =>
    new Promise((resolve, reject) => {
        profileDB.lastBlockNrs
            .where('ethAddress')
            .equals(ethAddress)
            .toArray()
            .then((data) => {
                const blockNr = data[0] ? data[0].blockNr : 0;
                resolve(blockNr);
            })
            .catch(reject);
    });
