"use strict";
const BaseContract_1 = require("./BaseContract");
const Promise = require("bluebird");
class RegistryStore extends BaseContract_1.default {
    constructor(instance) {
        super();
        this.contract = instance;
        this.contract.can_store.callAsync = Promise.promisify(this.contract.can_store.call);
        this.contract.has_store.callAsync = Promise.promisify(this.contract.has_store.call);
    }
    canStore(id, owner) {
        this.contract.can_store.callAsync(id, owner);
    }
    hasStore(id, owner) {
        this.contract.has_store.callAsync(id, owner);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegistryStore;
//# sourceMappingURL=RegistryStore.js.map