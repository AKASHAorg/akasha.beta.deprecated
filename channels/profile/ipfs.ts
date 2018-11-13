import * as Promise from 'bluebird';
import { CORE_MODULE, GENERAL_SETTINGS, PROFILE_CONSTANTS, PROFILE_MODULE } from '@akashaproject/common/constants';

export default function init(sp, getService) {

  const getShortProfile = Promise
  .coroutine(function* (hash: string, resolveAvatar: boolean) {
    const stash = getService(CORE_MODULE.STASH);
    const settings = getService(CORE_MODULE.SETTINGS);
    const ipfsConnector = getService(CORE_MODULE.IPFS_CONNECTOR);
    if (stash.profiles.hasShort(hash)) {
      return Promise.resolve(stash.profiles.getShort(hash));
    }
    const avatarPath = { [PROFILE_CONSTANTS.AVATAR]: '' };
    const aboutPath = { [PROFILE_CONSTANTS.ABOUT]: '' };
    const waitTime = settings.get(GENERAL_SETTINGS.OP_WAIT_TIME) || 15000;
    const profileBase = yield ipfsConnector.getInstance()
    .api.get(hash)
    .timeout(waitTime).catch(() => null);

    const avatar = yield ipfsConnector.getInstance()
    .api.findLinks(hash, [PROFILE_CONSTANTS.AVATAR]).timeout(waitTime).catch(() => '');

    const about = yield ipfsConnector.getInstance()
    .api.findLinks(hash, [PROFILE_CONSTANTS.ABOUT]).timeout(waitTime).catch(() => '');

    if (avatar.length) {
      if (!resolveAvatar) {
        avatarPath[PROFILE_CONSTANTS.AVATAR] = avatar[0].multihash;
      } else {
        avatarPath[PROFILE_CONSTANTS.AVATAR] = yield ipfsConnector.getInstance()
        .api.getFile(avatar[0].multihash).timeout(waitTime).catch(() => '');
      }
    }
    if (about.length) {
      aboutPath[PROFILE_CONSTANTS.ABOUT] = yield ipfsConnector.getInstance()
      .api.get(about[0].multihash).timeout(waitTime).catch(() => '');
    }
    const fetched = Object.assign({}, profileBase, avatarPath, aboutPath);

    stash.profiles.setShort(hash, fetched);
    return fetched;
  });

  const resolveProfile = Promise
  .coroutine(function* (hash: string, resolveImages: boolean) {
    const stash = getService(CORE_MODULE.STASH);
    const settings = getService(CORE_MODULE.SETTINGS);
    const ipfsConnector = getService(CORE_MODULE.IPFS_CONNECTOR);
    if (stash.profiles.hasFull(hash)) {
      return Promise.resolve(stash.profiles.getFull(hash));
    }
    const constructed = {
      [PROFILE_CONSTANTS.LINKS]: [],
      [PROFILE_CONSTANTS.BACKGROUND_IMAGE]: '',
    };
    const waitTime = settings.get(GENERAL_SETTINGS.OP_WAIT_TIME) || 15000;
    const shortProfile = yield getShortProfile(hash, resolveImages);
    const pool = yield ipfsConnector.getInstance()
    .api
    .findLinks(hash, [PROFILE_CONSTANTS.LINKS, PROFILE_CONSTANTS.BACKGROUND_IMAGE])
    .timeout(waitTime).catch(() => []);

    for (let i = 0; i < pool.length; i++) {
      constructed[pool[i].name] = yield ipfsConnector.getInstance()
      .api.get(pool[i].multihash).timeout(waitTime).catch(() => '');
    }
    const returned = Object.assign({}, shortProfile, constructed);
    stash.profiles.setFull(hash, returned);
    return returned;
  });
  const resolveService = function () {
    return resolveProfile;
  };
  const getShortProfileService = function () {
    return getShortProfile;
  };

  sp().service(PROFILE_MODULE.resolveProfile, resolveService);
  sp().service(PROFILE_MODULE.getShortProfile, getShortProfileService);
}
