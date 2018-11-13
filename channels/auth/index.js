import generateKeyInit from './generate-key';
import authInit from './Auth';
import { AUTH_MODULE } from '@akashaproject/common/constants';
const init = function init(sp, getService) {
    authInit(sp, getService);
    const generateKey = generateKeyInit(sp, getService);
    return {
        [AUTH_MODULE.generateEthKey]: generateKey,
    };
};
const app = {
    init,
    moduleName: AUTH_MODULE.$name,
};
export default app;
//# sourceMappingURL=index.js.map