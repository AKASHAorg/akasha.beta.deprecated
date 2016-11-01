import BaseService from './base-service';
import profileDB from './db/profile';

const Channel = window.Channel;
/**
 * Profile Service.
 * default open channels => ['getProfileData', 'getMyBalance', 'getIpfs']
 * available channels => ['manager', 'getProfileData', 'getMyBalance', 'getIpfs', 'unregister',
 *      'updateProfileData']
 */
class ProfileService extends BaseService {
    constructor () {
        super();
        this.serverManager = Channel.server.profile.manager;
        this.clientManager = Channel.client.profile.manager;
    }
    /**
     * Get ballance for a profile
     * Request:
     * @param {string} profileAddress. Optional
     * @param {string} unit
     * Response:
     * @param data = {
     *      value: string
     * }
     * @return new Promise
     */
    getProfileBalance = ({ options = { profile: '', unit: 'eth' }, onError = () => {}, onSuccess }) => {
        this.registerListener(
            Channel.client.profile.getMyBalance,
            this.createListener(onError, onSuccess)
        );
        Channel.server.profile.getMyBalance.send(options);
    };
    /**
     * retrieve profile data by eth address
     * Request:
     * @param profile <String> profile contract address
     * @param full <Boolean> (optional) resolve full profile from ipfs
     * Response:
     * @param data = {
     *      firstName: string;
     *      lastName: string;
     *      avatar?: Uint8Array;
     *      backgroundImage?: any;
     *      about?: string;
     *      links?: { title: string, url: string, type: string, id: number }[];
     * }
     */
    getProfileData = ({
        options = { profile: '', full: false }, onError = () => {}, onSuccess
    }) => {
        this.registerListener(
            Channel.client.profile.getProfileData,
            this.createListener(onError, onSuccess)
        );
        Channel.server.profile.getProfileData.send(options);
    };

    updateProfileData = ({ token, ipfs, gas = 2000000, onError = () => {}, onSuccess }) => {
        const clientChannel = Channel.client.profile.updateProfileData;
        const serverChannel = Channel.server.profile.updateProfileData;
        this.openChannel({
            serverManager: this.serverManager,
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                clientChannel.channelName
            )
        }, () => {
            serverChannel.send({ token, ipfs, gas });
        });
    };
    /**
     * retrieve profile data by ipfs address
     * Request:
     * @param ipfsHash <String> ipfs profile hash
     * @param full <Boolean> (optional) resolve full profile
     * Response:
     * same as `getProfileData`
     */
    getIpfs = ({
        options = { ipfsHash: '', full: false }, onError = () => {}, onSuccess
    }) => {
        this.registerListener(
            Channel.server.profile.getIpfs,
            this.createListener(onError, onSuccess)
        );
        Channel.server.profile.getIpfs.send(options);
    };
    /**
     * unregister profile -> delete profile from profiles registry contract
     * @todo gather more info and implement!
     */
    unregister = () => {};

    addUpdateProfileTx = ({ updateProfileTx, onError = () => {}, onSuccess }) => {
        console.log('adding update profile tx', updateProfileTx);
        profileDB.transaction('rw', profileDB.updateProfileTx, () =>
            profileDB.updateProfileTx.put(updateProfileTx)
        ).then((data) => {
            console.log('add updated profile success ', data);
            onSuccess(data);
        }).catch((reason) => {
            console.log('add updated profile error ', reason);
            onError(reason);
        });
    };

    deleteUpdateProfileTx = ({ tx, onError = () => {}, onSuccess }) => {
        profileDB.transaction('rw', profileDB.updateProfileTx, () =>
            profileDB.updateProfileTx.where('tx').equals(tx).delete()
        ).then(() => {
            console.log('delete updated profile success', tx);
            onSuccess();
        }).catch(reason => onError(reason));
    }

    getUpdateProfileTxs = ({ onError = () => {}, onSuccess }) => {
        profileDB.transaction('r', profileDB.updateProfileTx, () =>
            profileDB.updateProfileTx.toArray()
        )
        .then(data => onSuccess(data))
        .catch(reason => onError(reason));
    }
}

export { ProfileService };
