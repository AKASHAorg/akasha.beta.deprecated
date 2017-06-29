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
    profileDB.loggedProfile
        .where('account')
        .equals(profile.account)
        .toArray()
        .then((data) => {
            if (data.length) {
                const { expiration, token } = profile;
                // Update "expiration" and "token" fields on loggedProfile
                const loggedProfile = Object.assign({}, data[0], { expiration, token });
                profileDB.loggedProfile.put(loggedProfile);
            }
        })
        .catch(err => console.error(err));
