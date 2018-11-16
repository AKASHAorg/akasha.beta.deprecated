import * as Promise from 'bluebird';
import { CORE_MODULE, PROFILE_MODULE } from '@akashaproject/common/constants';

export const toggleDonations = {
  id: '/toggleDonations',
  type: 'object',
  properties: {
    status: { type: 'boolean' },
    token: { type: 'string' },
  },
  required: ['token', 'status'],
};

export default function init(sp, getService) {

  const execute = Promise.coroutine(
    function* (data: { status: boolean, token: string }, cb) {
      const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
      v.validate(data, toggleDonations, { throwError: true });
      const contracts = getService(CORE_MODULE.CONTRACTS);

      const currentProfile = yield (getService(PROFILE_MODULE.getCurrentProfile)).execute();
      if (!currentProfile.raw) {
        throw new Error('Need to register an akashaId to access this setting.');
      }

      const txData = contracts.instance
        .ProfileResolver
        .toggleDonations
        .request(currentProfile.raw, data.status, { gas: 200000 });
      const receipt = yield contracts.send(txData, data.token, cb);
      return {
        receipt,
      };
    });

  const toggleDonationsService = { execute, name: 'toggleDonations', hasStream: true };
  const service = function () {
    return toggleDonationsService;
  };
  sp().service(PROFILE_MODULE.toggleDonations, service);

  return toggleDonationsService;
}
