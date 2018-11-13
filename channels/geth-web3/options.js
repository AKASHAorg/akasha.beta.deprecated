import * as Promise from 'bluebird';
import { GETH_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* () {
        return {};
    });
    const options = { execute, name: 'options' };
    const service = function () {
        return options;
    };
    sp().service(GETH_MODULE.options, service);
    return options;
}
//# sourceMappingURL=options.js.map