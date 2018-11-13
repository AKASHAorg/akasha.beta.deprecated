import * as Promise from 'bluebird';
import { filter } from './set-filter';
import { NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        data.profiles.forEach((profileAddress) => {
            filter.removeAddress(profileAddress);
        });
        return Promise.resolve({ profiles: data.profiles });
    });
    const excludeFilter = { execute, name: 'excludeFilter' };
    const service = function () {
        return excludeFilter;
    };
    sp().service(NOTIFICATIONS_MODULE.excludeFilter, service);
    return excludeFilter;
}
//# sourceMappingURL=exclude-filter.js.map