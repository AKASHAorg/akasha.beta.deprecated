"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const get_entry_1 = require("./get-entry");
const execute = Promise.coroutine(function* (data) {
    const pool = data.map((entryObj) => {
        return get_entry_1.default.execute(entryObj);
    });
    const resolved = yield Promise.all(pool);
    return { collection: resolved };
});
exports.default = { execute, name: 'getEntryList' };
//# sourceMappingURL=get-entry-list.js.map