import * as Promise from 'bluebird';
import { CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';
import { getProfileDataSchema } from './profile-data';
export const getProfileList = {
    id: '/getProfileList',
    type: 'array',
    items: {
        $ref: '/getProfileData',
    },
    uniqueItems: true,
    minItems: 1,
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.addSchema(getProfileDataSchema, '/getProfileData');
        v.validate(data, getProfileList, { throwError: true });
        const profileData = getService(PROFILE_MODULE.profileData);
        const pool = data.map((profile) => {
            return profileData.execute(profile, cb).then(profileData => cb(null, profileData));
        });
        yield Promise.all(pool);
        return { done: true };
    });
    const getProfileLists = { execute, name: 'getProfileList', hasStream: true };
    const service = function () {
        return getProfileLists;
    };
    sp().service(PROFILE_MODULE.getProfileList, service);
    return getProfileLists;
}
//# sourceMappingURL=get-profile-list.js.map