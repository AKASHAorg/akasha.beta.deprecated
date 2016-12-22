import fetchRegistered from './fetch-registered';
import profileExists from './profile-exists';
import registerProfile from './register-profile';
import resolveEthAddress from './resolve-ethaddress';
import unRegister from './unregister-profile';
import currentProfile from './current-profile';
import addressOf from './address-of-akashaid';
import checkIdFormat from './check-id-format';

export default [
    fetchRegistered,
    addressOf,
    currentProfile,
    checkIdFormat,
    profileExists,
    registerProfile,
    resolveEthAddress,
    unRegister
];
