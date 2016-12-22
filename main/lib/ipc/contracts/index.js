"use strict";
const Profile_1 = require('./Profile');
const Registry_1 = require('./Registry');
const Tags_1 = require('./Tags');
const Feed_1 = require('./Feed');
const Faucet_1 = require('./Faucet');
const Entries_1 = require('./Entries');
const Comments_1 = require('./Comments');
const Subs_1 = require('./Subs');
const Votes_1 = require('./Votes');
const RegistryStore_1 = require('./RegistryStore');
const contracts_js_1 = require('@akashaproject/contracts.js');
class Contracts {
    init(web3) {
        const factory = new contracts_js_1.default.Class(web3);
        const registry = new Registry_1.default(factory.objects.registry);
        const registryStore = new RegistryStore_1.default(factory.objects.registry_store);
        const profile = new Profile_1.default(factory.classes.Profile);
        const tags = new Tags_1.default(factory.objects.tags);
        const feed = new Feed_1.default(factory.objects.feed);
        const subs = new Subs_1.default(factory.objects.subs);
        const faucet = new Faucet_1.default(factory.objects.faucet);
        const entries = new Entries_1.default(factory.objects.entries);
        const comments = new Comments_1.default(factory.objects.comments);
        const votes = new Votes_1.default(factory.objects.votes);
        this.instance = { profile, registry, registryStore, tags, feed, faucet, entries, comments, subs, votes };
        return this.instance;
    }
}
exports.constructed = new Contracts();
//# sourceMappingURL=index.js.map