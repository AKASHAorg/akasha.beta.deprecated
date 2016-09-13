"use strict";
const contracts_js_1 = require('@akashaproject/contracts.js');
const Registry_1 = require('./Registry');
const Profile_1 = require('./Profile');
const IndexedTags_1 = require('./IndexedTags');
const Main_1 = require('./Main');
const Tags_1 = require('./Tags');
class Contracts {
    init(web3) {
        const factory = new contracts_js_1.default.Class(web3);
        const registry = new Registry_1.default(factory.objects.registry);
        const profile = new Profile_1.default(factory.classes.AkashaProfile);
        const tags = new Tags_1.default(factory.objects.tags);
        const indexedTags = new IndexedTags_1.default(factory.objects.indexedTags);
        const main = new Main_1.default(factory.objects.akashaMain);
        this.instance = { indexedTags: indexedTags, main: main, profile: profile, registry: registry, tags: tags };
        return this.instance;
    }
}
exports.constructed = new Contracts();
//# sourceMappingURL=index.js.map