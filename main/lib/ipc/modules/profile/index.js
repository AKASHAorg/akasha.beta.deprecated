"use strict";
const ipfs_1 = require('./ipfs');
class Profile {
    init() {
        this.helpers = ipfs_1.default();
    }
}
exports.module = new Profile();
//# sourceMappingURL=index.js.map