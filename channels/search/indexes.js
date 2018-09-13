"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const searchIndex = require('search-index');
const constants_1 = require("@akashaproject/common/constants");
exports.dbs = {
    entry: {
        path: 'beta-entry-index',
        additional: {
            fieldOptions: {
                excerpt: {
                    searchable: true,
                    preserveCase: false,
                },
                title: {
                    searchable: true,
                    preserveCase: false,
                },
            },
        },
        searchIndex: null,
    },
    tags: {
        path: 'beta-tags-index',
        searchIndex: null,
        additional: {},
    },
    profiles: {
        path: 'beta-profileID-index',
        searchIndex: null,
        additional: {},
    },
};
class StorageIndex {
    constructor(dbPath, opts) {
        this.options = Object.assign({}, {
            indexPath: opts.prefix ? `${opts.prefix}${dbPath}` : dbPath,
            appendOnly: false,
            preserveCase: false,
            nGramLength: { gte: 1, lte: 4 },
        }, opts.additional);
    }
    init() {
        return Promise
            .fromCallback(cb => searchIndex(this.options, cb));
    }
}
function default_1(sp) {
    const dbService = function () {
        return exports.dbs;
    };
    sp().service(constants_1.CORE_MODULE.DB_INDEX, dbService);
    return { init: exports.init };
}
exports.default = default_1;
exports.init = function init(prefix) {
    const waitFor = Object.keys(exports.dbs).map((index) => {
        return new StorageIndex(exports.dbs[index].path, { prefix, additional: exports.dbs[index].additional }).init()
            .then(si => exports.dbs[index].searchIndex = si);
    });
    return Promise.all(waitFor);
};
//# sourceMappingURL=indexes.js.map