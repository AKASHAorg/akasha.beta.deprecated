import * as Promise from 'bluebird';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

const getScoreS = {
  id: '/getScore',
  type: 'object',
  properties: {
    entryId: { type: 'string' },
  },
  required: ['entryId'],
};

export default function init(sp, getService) {
  const execute = Promise
    .coroutine(function* (data: { entryId: string }) {
      const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
      v.validate(data, getScoreS, { throwError: true });

      const score = yield (getService(CORE_MODULE.CONTRACTS))
        .instance.Votes.getRecord(data.entryId);

      return { score: (score[1]).toString(10), entryId: data.entryId };
    });

  const getScore = { execute, name: 'getScore' };
  const service = function () {
    return getScore;
  };
  sp().service(ENTRY_MODULE.getScore, service);
  return getScore;
}
