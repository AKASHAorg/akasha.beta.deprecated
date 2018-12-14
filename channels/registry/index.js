import fetchRegisteredInit from './fetch-registered';
import profileExistsInit from './profile-exists';
import registerProfileInit from './register-profile';
import addressOfInit from './address-of-akashaid';
import checkIdFormatInit from './check-id-format';
import { REGISTRY_MODULE } from '@akashaproject/common/constants';
const init = function init(sp, getService) {
    const fetchRegistered = fetchRegisteredInit(sp, getService);
    const profileExists = profileExistsInit(sp, getService);
    const checkIdFormat = checkIdFormatInit(sp, getService);
    const registerProfile = registerProfileInit(sp, getService);
    const addressOf = addressOfInit(sp, getService);
    return {
        [REGISTRY_MODULE.fetchRegistered]: fetchRegistered,
        [REGISTRY_MODULE.profileExists]: profileExists,
        [REGISTRY_MODULE.checkIdFormat]: checkIdFormat,
        [REGISTRY_MODULE.registerProfile]: registerProfile,
        [REGISTRY_MODULE.addressOf]: addressOf,
    };
};
const app = {
    init,
    moduleName: REGISTRY_MODULE.$name,
};
export default app;
//# sourceMappingURL=index.js.map