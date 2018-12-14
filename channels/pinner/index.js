import runnerInit from './runner';
import { PINNER_MODULE } from '@akashaproject/common/constants';
const init = function init(sp, getService) {
    const runner = runnerInit(sp, getService);
    return { [PINNER_MODULE.pin]: runner };
};
const app = {
    init,
    moduleName: PINNER_MODULE.$name,
};
export default app;
//# sourceMappingURL=index.js.map