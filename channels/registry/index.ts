import fetchRegisteredInit from './fetch-registered';
import profileExistsInit from './profile-exists';
import registerProfileInit from './register-profile';
import addressOfInit from './address-of-akashaid';
import checkIdFormatInit from './check-id-format';

export const moduleName = 'registry';
const init = function init(sp, getService) {

  const fetchRegistered = fetchRegisteredInit(sp, getService);
  const profileExists = profileExistsInit(sp, getService);
  const checkIdFormat = checkIdFormatInit(sp, getService);
  const registerProfile = registerProfileInit(sp, getService);
  const addressOf = addressOfInit(sp, getService);

  return {
    fetchRegistered,
    profileExists,
    checkIdFormat,
    registerProfile,
    addressOf,
  };
};

const app = {
  init,
  moduleName,
};

export default app;
