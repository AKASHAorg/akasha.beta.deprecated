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
import { PROFILE_MODULE } from '@akashaproject/common/constants';

const init = function init (sp, getService) {

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
    [PROFILE_MODULE.getBalance]: currentBalance,
    [PROFILE_MODULE.getCommentsCount]: commentsCount,
    [PROFILE_MODULE.commentsIterator]: commentsIterator,
    [PROFILE_MODULE.followProfile]: followProfile,
    [PROFILE_MODULE.followersCount]: followersCount,
    [PROFILE_MODULE.followingCount]: followingCount,
    [PROFILE_MODULE.profileData]: profileData,
    [PROFILE_MODULE.unFollowProfile]: unFollowProfile,
    [PROFILE_MODULE.updateProfileData]: updateProfileData,
    [PROFILE_MODULE.followersIterator]: followersIterator,
    [PROFILE_MODULE.followingIterator]: followingIterator,
    [PROFILE_MODULE.isFollower]: isFollower,
    [PROFILE_MODULE.getProfileList]: getProfileList,
    [PROFILE_MODULE.sendTip]: sendTip,
    [PROFILE_MODULE.resolveProfileIpfsHash]: resolveProfileIpfsHash,
    [PROFILE_MODULE.toggleDonations]: toggleDonations,
    [PROFILE_MODULE.bondAeth]: bondAeth,
    [PROFILE_MODULE.cycleAeth]: cycleAeth,
    [PROFILE_MODULE.freeAeth]: freeAeth,
    [PROFILE_MODULE.transformEssence]: transformEssence,
    [PROFILE_MODULE.manaBurned]: manaBurned,
    [PROFILE_MODULE.cyclingStates]: cyclingStates,
    [PROFILE_MODULE.transfer]: transfer,
    [PROFILE_MODULE.transfersIterator]: transfersIterator,
    [PROFILE_MODULE.essenceIterator]: essenceIterator,
    [PROFILE_MODULE.votesIterator]: votesIterator,
    [PROFILE_MODULE.karmaRanking]: karmaRanking,
    [PROFILE_MODULE.getByAddress]: getByAddress,
    [PROFILE_MODULE.getCurrentProfile]: getCurrentProfile,
  };
};

const app = {
  init,
  moduleName: PROFILE_MODULE.$name,
};

export default app;
