import ipfsHelpersInit from './ipfs-helpers';
import profileHelpersInit from './profile-helpers';
import getLocalIdentitiesInit from './get-local-identities';
import loginInit from './login';
import logoutInit from './logout';
import requestAethInit from './request-aeth';
import { COMMON_MODULE } from './constants';
const init = function init(sp, getService) {
    ipfsHelpersInit(sp);
    profileHelpersInit(sp, getService);
    const getLocalIdentities = getLocalIdentitiesInit(sp, getService);
    const login = loginInit(sp, getService);
    const logout = logoutInit(sp, getService);
    const requestAeth = requestAethInit(sp, getService);
    return {
        [COMMON_MODULE.getLocalIdentities]: getLocalIdentities,
        [COMMON_MODULE.login]: login,
        [COMMON_MODULE.logout]: logout,
        [COMMON_MODULE.requestEther]: requestAeth,
    };
};
const app = {
    init,
    moduleName: COMMON_MODULE.$name,
};
export default app;
//# sourceMappingURL=index.js.map