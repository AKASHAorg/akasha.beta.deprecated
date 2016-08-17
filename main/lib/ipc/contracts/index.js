"use strict";
const contracts_js_1 = require('@akashaproject/contracts.js');
const Registry_1 = require('./Registry');
const Profile_1 = require('./Profile');
class Contracts {
    init(web3) {
        this.instance = new contracts_js_1.default.Class(web3);
        const registry = new Registry_1.default(this.instance.objects.registry);
        const profile = new Profile_1.default(this.instance.classes.AkashaProfile);
    }
}
exports.constructed = new Contracts();
//# sourceMappingURL=index.js.map