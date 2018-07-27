"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const indexes_1 = require("./indexes");
exports.flushSchema = {
    id: '/flush',
    type: 'object',
    properties: {
        target: { type: 'string' },
    },
    required: ['target'],
};
const modules = ['entry', 'tags', 'profiles'];
function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data, cb) {
        const v = new getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA).Validator();
        v.validate(data, exports.flushSchema, { throwError: true });
        if (modules.indexOf(data.target) === -1) {
            throw new Error('target is not recognized');
        }
        indexes_1.dbs[data.target].searchIndex.flush(function (err) {
            if (err) {
                return cb(err);
            }
            cb('', { done: true });
        });
        return { done: false };
    });
    const flush = { execute, name: 'flush', hasStream: true };
    const service = function () {
        return flush;
    };
    sp().service(constants_1.SEARCH_MODULE.flush, service);
    return flush;
}
exports.default = init;
//# sourceMappingURL=clear-index.js.map