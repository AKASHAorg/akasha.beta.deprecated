import getLicenceByIdInit from './get-licence-by-Id';
import getLicencesInit from './get-licences';
import { LICENCE_MODULE } from '@akashaproject/common/constants';
const init = function init(sp, getService) {
    const getLicenceById = getLicenceByIdInit(sp, getService);
    const getLicences = getLicencesInit(sp, getService);
    return {
        [LICENCE_MODULE.getLicenceById]: getLicenceById,
        [LICENCE_MODULE.getLicences]: getLicences,
    };
};
const app = {
    init,
    moduleName: LICENCE_MODULE.$name,
};
export default app;
//# sourceMappingURL=index.js.map