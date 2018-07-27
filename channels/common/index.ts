import ipfsHelpersInit from './ipfs-helpers';
import profileHelpersInit from './profile-helpers';
import getLocalIdentitiesInit from './get-local-identities';
import loginInit from './login';
import logoutInit from './logout';
import requestAethInit from './request-aeth';

export const moduleName = 'common';
const init = function init(sp, getService) {
  ipfsHelpersInit(sp);
  profileHelpersInit(sp, getService);
  const getLocalIdentities = getLocalIdentitiesInit(sp, getService);
  const login = loginInit(sp, getService);
  const logout = logoutInit(sp, getService);
  const requestAeth = requestAethInit(sp, getService);

  return {
    getLocalIdentities,
    login,
    logout,
    requestAeth,
  };
};

const app = {
  init,
  moduleName,
};

export default app;
