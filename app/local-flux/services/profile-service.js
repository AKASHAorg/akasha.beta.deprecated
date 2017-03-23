import BaseService from './base-service';
import profileDB from './db/profile';

const Channel = global.Channel;
/**
 * Profile Service.
 * default open channels => ['getProfileData', 'getMyBalance', 'getIpfs']
 * available channels => ['manager', 'getProfileData', 'updateProfileData', 'getMyBalance',
 *      'getIpfs', 'unregister', 'follow', 'getFollowersCount', 'getFollowingCount',
 *      'getFollowers', 'getFollowing']
 */
class ProfileService extends BaseService {
    constructor () {
        super();
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
    getProfileBalance = ({ options = { etherBase: '', unit: 'eth' }, onError = () => {}, onSuccess }) => {
        this.registerListener(
            Channel.client.profile.getBalance,
            this.createListener(onError, onSuccess)
        );
        Channel.server.profile.getBalance.send(options);
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

    getProfileList = ({ profiles, onError = () => {}, onSuccess }) => {
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.profile.getProfileList,
            clientChannel: Channel.client.profile.getProfileList,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => {
            Channel.server.profile.getProfileList.send(profiles);
        });
    }

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
    unregister = () => {
    };

    getFollowersCount = ({ akashaId, onError = () => {}, onSuccess }) => {
        const clientChannel = Channel.client.profile.getFollowersCount;
        const serverChannel = Channel.server.profile.getFollowersCount;
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                clientChannel.channelName
            )
        }, () => {
            serverChannel.send({ akashaId });
        });
    };

    getFollowingCount = ({ akashaId, onError = () => {}, onSuccess }) => {
        const clientChannel = Channel.client.profile.getFollowingCount;
        const serverChannel = Channel.server.profile.getFollowingCount;
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                clientChannel.channelName
            )
        }, () => {
            serverChannel.send({ akashaId });
        });
    };

    followersIterator = ({ akashaId, start, limit, onError = () => {}, onSuccess }) => {
        const clientChannel = Channel.client.profile.followersIterator;
        const serverChannel = Channel.server.profile.followersIterator;
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                clientChannel.channelName
            )
        }, () => {
            serverChannel.send({ akashaId, start, limit });
        });
    };

    moreFollowersIterator = ({ akashaId, start, limit, onError = () => {}, onSuccess }) =>
        this.registerListener(
            Channel.client.profile.followersIterator,
            this.createListener(onError, onSuccess),
            () => Channel.server.profile.followersIterator.send({ akashaId, start, limit })
        );

    followingIterator = ({ akashaId, start, limit, onError = () => {}, onSuccess }) => {
        const clientChannel = Channel.client.profile.followingIterator;
        const serverChannel = Channel.server.profile.followingIterator;
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                clientChannel.channelName
            )
        }, () => {
            serverChannel.send({ akashaId, start, limit });
        });
    };

    moreFollowingIterator = ({ akashaId, start, limit, onError = () => {}, onSuccess }) =>
        this.registerListener(
            Channel.client.profile.followingIterator,
            this.createListener(onError, onSuccess),
            () => Channel.server.profile.followingIterator.send({ akashaId, start, limit })
        );
    getFollowingsList = ({ akashaId, onSuccess, onError }) => {
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel: Channel.server.profile.getFollowingList,
            clientChannel: Channel.client.profile.getFollowingList,
            listenerCb: this.createListener(onError, onSuccess)
        }, () => Channel.server.profile.getFollowingList.send({ akashaId }));
    };

    follow = ({ token, akashaId, gas = 2000000, onError = () => {}, onSuccess }) => {
        const clientChannel = Channel.client.profile.followProfile;
        const serverChannel = Channel.server.profile.followProfile;
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(
                onError,
                onSuccess
            )
        }, () => {
            serverChannel.send({ token, akashaId, gas });
        });
    };

    unfollow = ({ token, akashaId, gas = 2000000, onError = () => {}, onSuccess }) => {
        const clientChannel = Channel.client.profile.unFollowProfile;
        const serverChannel = Channel.server.profile.unFollowProfile;
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                clientChannel.channelName
            )
        }, () => {
            serverChannel.send({ token, akashaId, gas });
        });
    };

    isFollower = ({ akashaId, following, onError = () => {}, onSuccess }) => {
        const clientChannel = Channel.client.profile.isFollower;
        const serverChannel = Channel.server.profile.isFollower;
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                clientChannel.channelName
            )
        }, () => {
            serverChannel.send({ akashaId, following });
        });
    };

    sendTip = ({ token, akashaId, receiver, value, gas = 2000000, onError, onSuccess }) => {
        const clientChannel = Channel.client.profile.tip;
        const serverChannel = Channel.server.profile.tip;
        this.openChannel({
            clientManager: this.clientManager,
            serverChannel,
            clientChannel,
            listenerCb: this.createListener(
                onError,
                onSuccess,
                clientChannel.channelName
            )
        }, () => {
            serverChannel.send({ token, akashaId, receiver, value, gas });
        });
    };

    saveAkashaIds = akashaIds =>
        profileDB.knownAkashaIds
            .bulkPut(akashaIds)
            .catch(error => console.error(error));

    searchInKnownAkashaIds = ({ search, onSuccess }) => {
        if (search && search.length) {
            profileDB.knownAkashaIds
                .where('akashaId')
                .startsWith(search)
                .toArray()
                .then(data => onSuccess(data.slice(0, 5).map(obj => obj.akashaId)))
                .catch(err => console.error(err));
        }
    };
}

export { ProfileService };
