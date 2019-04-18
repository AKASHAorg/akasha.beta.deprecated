import { CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

export default function init (sp, getService) {

  const execute = () => (getService(PROFILE_MODULE.getByAddress)).execute(
    { ethAddress: (getService(CORE_MODULE.WEB3_API)).instance.eth.defaultAccount },
  );

  const getCurrentProfile = { execute, name: 'getCurrentProfile' };
  const service = function () {
    return getCurrentProfile;
  };
  sp().service(PROFILE_MODULE.getCurrentProfile, service);
  return getCurrentProfile;
}
