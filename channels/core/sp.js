import * as Bottle from 'bottlejs';
import { CORE_MODULE } from '@akashaproject/common/constants';
Bottle.config['strict'] = true;
const akashaSp = new Bottle();
const getSp = function () {
    return akashaSp;
};
export const getService = function (name) {
    return akashaSp.container[name];
};
export const getCoreServices = function () {
    return {
        [CORE_MODULE.WEB3_HELPER]: getService(CORE_MODULE.WEB3_HELPER),
        [CORE_MODULE.SETTINGS]: getService(CORE_MODULE.SETTINGS),
        [CORE_MODULE.CONTRACTS]: getService(CORE_MODULE.CONTRACTS),
        [CORE_MODULE.WEB3_API]: getService(CORE_MODULE.WEB3_API),
        [CORE_MODULE.STASH]: getService(CORE_MODULE.STASH),
    };
};
export default getSp;
//# sourceMappingURL=sp.js.map