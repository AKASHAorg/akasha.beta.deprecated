import profileDB from './db/profile';

/**
 * Create a temporary profile in indexedDB
 * Notice: use `Table.add()` to prevent accidental update of the publishing temp profile
 *
 * @param {object} profileData - Data of the profile created
 * @param {object} currentStatus - Current status of the profile creation process
 */
export const createTempProfile = profileData =>
    profileDB.tempProfile
        .where('akashaId')
        .equals(profileData.akashaId)
        .first()
        .then((profile) => {
            if (profile) {
                return Promise.resolve(profile);
            }
            return profileDB.tempProfile.add({
                ...profileData
            })
                .then(akashaId =>
                    // return newly created temp profile
                    profileDB.tempProfile.where('akashaId').equals(akashaId).first()
                ).catch('ConstraintError', () =>
                    // key already exists in the object store
                    profileDB.tempProfile.where('akashaId').equals(profileData.akashaId).first()
                );
        })
        .catch((err) => {
            console.error(err, 'db error!');
            return err;
        });
/**
 * update temp profile
 * handles temp profile nested updates
 * @param tempProfile <Object> with key/val that must be updated
 * @param status <Object> Optional, status of the temp profile
 * @return Promise => when resolved => profileData
 */

export const updateTempProfile = (tempProfile, status) =>
    profileDB.tempProfile
        .where('akashaId')
        .equals(tempProfile.akashaId)
        .modify((tmpProf) => {
            Object.keys(tempProfile).forEach((key) => {
                tmpProf[key] = tempProfile[key];
            });
            if (status && typeof status === 'object') {
                if (!tmpProf.status) tmpProf.status = {};
                Object.keys(status).forEach((key) => {
                    tmpProf.status[key] = status[key];
                });
            }
        })
        .then((updated) => {
            if (updated) {
                return profileDB.tempProfile
                    .where('akashaId')
                    .equals(tempProfile.akashaId)
                    .first();
            }
            return tempProfile;
        })
        .catch(err => err);
/**
 * Delete temporary profile. Called after profile was successfully created
 */
export const deleteTempProfile = akashaId =>
    profileDB.tempProfile
        .delete(akashaId);

/**
 * Get all available temporary profiles
 * @return promise
 */
export const getTempProfile = () =>
    profileDB.tempProfile.toCollection().first().then((profile) => {
        if (!profile) {
            return {};
        }
        return profile;
    });
