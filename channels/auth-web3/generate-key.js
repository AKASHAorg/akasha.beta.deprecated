import * as Promise from 'bluebird';
import { AUTH_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        return true;
    });
    const generateEthKey = { execute, name: 'generateEthKey' };
    const service = function () {
        return generateEthKey;
    };
    sp().service(AUTH_MODULE.generateEthKey, service);
    return generateEthKey;
}
//# sourceMappingURL=generate-key.js.map