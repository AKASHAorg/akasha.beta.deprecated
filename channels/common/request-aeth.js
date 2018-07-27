"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const superagent_1 = require("superagent");
const constants_1 = require("./constants");
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const FAUCET_URL = getService(constants_1.CORE_MODULE.SETTINGS).get(constants_1.GENERAL_SETTINGS.FAUCET_URL);
        const FAUCET_TOKEN = getService(constants_1.CORE_MODULE.SETTINGS).get(constants_1.GENERAL_SETTINGS.FAUCET_TOKEN);
        const response = yield Promise.fromCallback(function (cb1) {
            return superagent_1.post(FAUCET_URL)
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
        getService(constants_1.CORE_MODULE.CONTRACTS).watchTx(response.tx)
            .then(success => cb('', success)).catch(err => cb(err));
        return response;
    });
    const requestEther = { execute, name: 'requestEther', hasStream: true };
    const service = function () {
        return requestEther;
    };
    sp().service(constants_1.AUTH_MODULE.requestEther, service);
    return requestEther;
}
exports.default = init;
//# sourceMappingURL=request-aeth.js.map