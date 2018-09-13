"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const allStreamIteratorS = {
    id: '/allStreamIterator',
    type: 'object',
    properties: {
        limit: { type: 'number' },
        toBlock: { type: 'number' },
        lastIndex: { type: 'number' },
        reversed: { type: 'boolean' },
    },
    required: ['toBlock'],
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, allStreamIteratorS, { throwError: true });
        const maxResults = data.limit || 5;
        return getService(constants_1.ENTRY_MODULE.helpers).fetchFromPublish(Object.assign({}, data, {
            limit: maxResults,
            args: {},
            reversed: data.reversed || false,
        }));
    });
    const allStreamIterator = { execute, name: 'allStreamIterator' };
    const service = function () {
        return allStreamIterator;
    };
    sp().service(constants_1.ENTRY_MODULE.allStreamIterator, service);
    return allStreamIterator;
}
exports.default = init;
//# sourceMappingURL=all-stream-iterator.js.map