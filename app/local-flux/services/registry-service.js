import { akashaDB, getProfileCollection } from './db/dbs';
import * as Promise from 'bluebird';

export const TMP_PROFILE_TYPE = 'tempProfile';
/**
 * Create a temporary profile in indexedDB
 * Notice: use `Table.add()` to prevent accidental update of the publishing temp profile
 *
 * @param {object} profileData - Data of the profile created
 * @param {object} currentStatus - Current status of the profile creation process
 */
export const createTempProfile = profileData => {
    try {
        getProfileCollection().findAndRemove({
            ethAddress: profileData.ethAddress,
            opType: TMP_PROFILE_TYPE
        });
        const record = getProfileCollection().insert(
            Object.assign({ opType: TMP_PROFILE_TYPE }, profileData)
        );
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => Object.assign({}, record));
    } catch (error) {
        return Promise.reject(error);
    }
};
/**
 * update temp profile
 * handles temp profile nested updates
 * @param tempProfile <Object> with key/val that must be updated
 * @param status <Object> Optional, status of the temp profile
 * @return Promise => when resolved => profileData
 */

export const updateTempProfile = (tempProfile, status) => {
    try {
        const record = getProfileCollection().findAndUpdate(
            { ethAddress: tempProfile.ethAddress, opType: TMP_PROFILE_TYPE },
            rec => {
                Object.assign(rec, tempProfile);
                if (status && typeof status === 'object') {
                    if (!rec.status) rec['status'] = {};
                    Object.assign(rec.status, status);
                }
            }
        );
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb)).then(() => Object.assign({}, record));
    } catch (error) {
        return Promise.reject(error);
    }
};
/**
 * Delete temporary profile. Called after profile was successfully created
 */
export const deleteTempProfile = ethAddress => {
    try {
        getProfileCollection().findAndRemove({ ethAddress: ethAddress, opType: TMP_PROFILE_TYPE });
        return Promise.fromCallback(cb => akashaDB.saveDatabase(cb));
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Get all available temporary profiles
 * @return promise
 */
export const getTempProfile = ethAddress => {
    try {
        const record = getProfileCollection().findOne({ ethAddress: ethAddress, opType: TMP_PROFILE_TYPE });
        return Promise.resolve(record ? Object.assign({}, record) : null);
    } catch (error) {
        return Promise.reject(error);
    }
};
/**
 * Registry Service.
 * default open channels => ['getCurrentProfile', 'getByAddress']
 * available channels =>
 * ['manager', 'profileExists', 'registerProfile', 'getCurrentProfile', 'getByAddress']
 */
// class RegistryService extends BaseService {
//     constructor () {
//         super();
//         this.clientManager = Channel.client.registry.manager;
//     }

//     /**
//      * create a new profile
//      * Request:
//      * @param <object> {
//      *      token: String;
//      *      akashaId: string;
//      *      ipfs: IpfsProfileCreateRequest;
//      *      gas?: number;
//      * }
//      * Response:
//      * @param data = { tx: string }
//      */
//     registerProfile = ({ token, akashaId, ipfs, gas = 2000000, onError, onSuccess }) => {
//         this.openChannel({
//             clientManager: this.clientManager,
//             serverChannel: Channel.server.registry.registerProfile,
//             clientChannel: Channel.client.registry.registerProfile,
//             listenerCb: this.createListener(
//                 onError,
//                 onSuccess,
//                 Channel.client.registry.registerProfile.channelName
//             )
//         }, () => {
//             Channel.server.registry.registerProfile.send({ token, akashaId, ipfs, gas });
//         });
//     };
//     /**
//      * Get eth address of the logged profile
//      * Request: {}
//      * Response:
//      * @param data = {ethAddress: String}
//      */
//     getCurrentProfile = ({ onError, onSuccess }) => {
//         this.registerListener(
//             Channel.client.registry.getCurrentProfile,
//             this.createListener(onError, onSuccess)
//         );
//         Channel.server.registry.getCurrentProfile.send({});
//     };
//     /**
//      * return contract address for a given eth address
//      * Request:
//      *  @param ethAddress <String> eth address
//      * Response:
//      *  @param data = { profileAddress: String } -> profile contract address
//      */
//     getByAddress = ({ ethAddress, onSuccess, onError }) => {
//         this.registerListener(
//             Channel.client.registry.getByAddress,
//             this.createListener(onError, onSuccess)
//         );
//         Channel.server.registry.getByAddress.send(ethAddress);
//     };
//     /**
//      * Update temporary profile in indexedDB
//      * @param {string} akashaId
//      * @param {object} changes - Contains data of the updated profile
//      * @return promise
//      */
//
// }

// export { RegistryService };
