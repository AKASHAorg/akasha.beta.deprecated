import * as Promise from 'bluebird';
import { post as POST } from 'superagent';
import { AUTH_MODULE, CORE_MODULE, GENERAL_SETTINGS } from './constants';

export default function init(sp, getService) {
  const execute = Promise.coroutine(function* (data, cb) {
    const FAUCET_URL = getService(CORE_MODULE.SETTINGS).get(GENERAL_SETTINGS.FAUCET_URL);
    const FAUCET_TOKEN = getService(CORE_MODULE.SETTINGS).get(GENERAL_SETTINGS.FAUCET_TOKEN);
    const response = yield Promise.fromCallback(function (cb1) {
      return POST(FAUCET_URL)
        .set('Content-Type', 'application/json')
        .send({ address: data.address, token: FAUCET_TOKEN })
        .end(cb1);
    }).then((body) => {
      if (body.ok && body.text) {
        return JSON.parse(body.text);
      }
      return body;
    });

    if (!response.tx) {
      throw new Error('The request could not be completed.');
    }

    getService(CORE_MODULE.CONTRACTS).watchTx(response.tx)
      .then(success => cb('', success)).catch(err => cb(err));
    return response;

  });

  const requestEther = { execute, name: 'requestEther', hasStream: true };
  const service = function () {
    return requestEther;
  };
  sp().service(AUTH_MODULE.requestEther, service);
  return requestEther;
}
