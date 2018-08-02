import cycleAethInit from './aeth-cycle';
import freeAethInit from './aeth-free';
import transfersIteratorInit from './aeth-transfers-iterator';
import bondAethInit from './bond-aeth';
import commentsCountInit from './comments-count';
import commentsIteratorInit from './comments-iterator';
import currentBalanceInit from './current-balance';
import getCurrentProfileInit from './current-profile';
import cyclingStatesInit from './cycling-states';
import essenceIteratorInit from './essence-iterator';
import followProfileInit from './follow-profile';
import followersCountInit from './followers-count';
import followersIteratorInit from './followers-iterator';
import followingCountInit from './following-count';
import followingIteratorInit from './following-iterator';
import getProfileListInit from './get-profile-list';
import profileIpfsInit from './ipfs';
import isFollowerInit from './is-follower';
import manaBurnedInit from './mana-burned';
import profileDataInit from './profile-data';
import karmaRankingInit from './ranking';
import getByAddressInit from './resolve-ethaddress';
import resolveProfileIpfsHashInit from './resolve-profile-ipfs-hash';
import sendTipInit from './send-tip';
import toggleDonationsInit from './toggle-donations';
import transferInit from './transfer';
import transformEssenceInit from './transform-essence';
import unFollowProfileInit from './unfollow-profile';
import updateProfileInit from './update-profile';
import votesIteratorInit from './votes-iterator';


export const moduleName = 'profile';

const init = function init(sp, getService) {

  const currentBalance = currentBalanceInit(sp, getService);
  const commentsCount = commentsCountInit(sp, getService);
  const commentsIterator = commentsIteratorInit(sp, getService);
  const followProfile = followProfileInit(sp, getService);
  const getCurrentProfile = getCurrentProfileInit(sp, getService);
  const followersCount = followersCountInit(sp, getService);
  const followingCount = followingCountInit(sp, getService);
  const profileData = profileDataInit(sp, getService);
  const getByAddress = getByAddressInit(sp, getService);
  const unFollowProfile = unFollowProfileInit(sp, getService);
  const updateProfileData = updateProfileInit(sp, getService);
  const followersIterator = followersIteratorInit(sp, getService);
  const followingIterator = followingIteratorInit(sp, getService);
  const isFollower = isFollowerInit(sp, getService);
  const getProfileList = getProfileListInit(sp, getService);
  const sendTip = sendTipInit(sp, getService);
  const resolveProfileIpfsHash = resolveProfileIpfsHashInit(sp, getService);
  const toggleDonations = toggleDonationsInit(sp, getService);
  const bondAeth = bondAethInit(sp, getService);
  const cycleAeth = cycleAethInit(sp, getService);
  const freeAeth = freeAethInit(sp, getService);
  const transformEssence = transformEssenceInit(sp, getService);
  const manaBurned = manaBurnedInit(sp, getService);
  const cyclingStates = cyclingStatesInit(sp, getService);
  const transfer = transferInit(sp, getService);
  const transfersIterator = transfersIteratorInit(sp, getService);
  const essenceIterator = essenceIteratorInit(sp, getService);
  const votesIterator = votesIteratorInit(sp, getService);
  const karmaRanking = karmaRankingInit(sp, getService);

  profileIpfsInit(sp, getService);

  return {
    currentBalance,
    commentsCount,
    commentsIterator,
    followProfile,
    followersCount,
    followingCount,
    profileData,
    unFollowProfile,
    updateProfileData,
    followersIterator,
    followingIterator,
    isFollower,
    getProfileList,
    sendTip,
    resolveProfileIpfsHash,
    toggleDonations,
    bondAeth,
    cycleAeth,
    freeAeth,
    transformEssence,
    manaBurned,
    cyclingStates,
    transfer,
    transfersIterator,
    essenceIterator,
    votesIterator,
    karmaRanking,
    getByAddress,
    getCurrentProfile,
  };
};

const app = {
  init,
  moduleName,
};

export default app;
