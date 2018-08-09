"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const SearchIndex = require("search-index");
const constants_1 = require("@akashaproject/common/constants");
exports.dbs = {
    entry: {
        path: 'akasha#beta/entry-index',
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
        path: 'akasha#beta/tags-index',
        searchIndex: null,
        additional: {},
    },
    profiles: {
        path: 'akasha#beta/profileID-index',
        searchIndex: null,
        additional: {},
    },
};
class StorageIndex {
    constructor(dbPath, additional) {
        this.options = Object.assign({}, {
            indexPath: dbPath,
            appendOnly: false,
            preserveCase: false,
            nGramLength: { gte: 1, lte: 4 },
        }, additional);
    }
    init() {
        return Promise
            .fromCallback((cb) => SearchIndex(this.options, cb));
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
exports.init = function init() {
    const waitFor = Object.keys(exports.dbs).map((index) => {
        return new StorageIndex(exports.dbs[index].path, exports.dbs[index].additional).init()
            .then(si => exports.dbs[index].searchIndex = si);
    });
    return Promise.all(waitFor);
};
//# sourceMappingURL=indexes.js.map