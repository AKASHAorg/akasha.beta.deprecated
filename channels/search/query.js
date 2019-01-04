"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
const indexes_1 = require("./indexes");
const querySchema = {
    id: '/query',
    type: 'object',
    properties: {
        text: { type: 'string' },
        authors: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            minItems: 1,
        },
        pageSize: { type: 'number' },
        offset: { type: 'number' },
    },
    required: ['text'],
};
const buildFilter = function (authors, text) {
    const result = [];
    authors.forEach((ethAddress) => {
        result.push({ AND: { ethAddress: [ethAddress], title: [text] }, BOOST: 5 });
        result.push({ AND: { ethAddress: [ethAddress], excerpt: [text] } });
    });
    return result;
};
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, querySchema, { throwError: true });
        const collection = [];
        const pageSize = data.pageSize || 20;
        const offset = data.offset || 0;
        const defaultQuery = [{ AND: { title: [data.text] }, BOOST: 5 }, { AND: { excerpt: [data.text] } }];
        const query = (data.authors && data.authors.length) ?
            buildFilter(data.authors, data.text) : defaultQuery;
        indexes_1.dbs.entry.searchIndex.totalHits({ query }, function (err, count) {
            indexes_1.dbs.entry.searchIndex.search({
                query,
                pageSize,
                offset,
            })
                .on('data', (data) => {
                collection.push({
                    entryId: data.document.id,
                    ethAddress: data.document.ethAddress,
                    version: data.document.version,
                });
            }).on('end', () => {
                cb('', { collection, totalHits: count, searching: false });
            });
        });
        return { searching: true };
    });
    const query = { execute, name: 'query', hasStream: true };
    const service = function () {
        return query;
    };
    sp().service(constants_1.SEARCH_MODULE.query, service);
    return query;
}
exports.default = init;
//# sourceMappingURL=query.js.map