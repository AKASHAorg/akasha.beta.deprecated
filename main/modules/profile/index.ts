import currentBalance from './current-balance';
import followProfile from './follow-profile';
import followersCount from './followers-count';
import followingCount from './following-count';
import profileData from './profile-data';
import unfollowProfile from './unfollow-profile';
import updateProfile from './update-profile';
import followersIterator from './followers-iterator';
import followingIterator from './following-iterator';
import isFollower from './is-follower';
import isFollowing from './is-following';
import followingList from './following-list';
import getProfileList from './get-profile-list';
import sendTip from './send-tip';
import resolveProfileIpfsHash from './resolve-profile-ipfs-hash';
import toggleDonations from './toggle-donations';
import bondAeth from './bond-aeth';
import cycleAeth from './aeth-cycle';
import freeAeth from './aeth-free';
import transformEssence from './transform-essence';

export default [
    bondAeth,
    cycleAeth,
    currentBalance,
    followProfile,
    followersCount,
    followingCount,
    followingList,
    freeAeth,
    isFollower,
    isFollowing,
    profileData,
    transformEssence,
    unfollowProfile,
    updateProfile,
    followersIterator,
    followingIterator,
    getProfileList,
    sendTip,
    resolveProfileIpfsHash,
    toggleDonations
];
