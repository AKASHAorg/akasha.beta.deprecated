"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Auth_1 = require("./Auth");
class User {
    init() {
        this.auth = new Auth_1.default();
    }
}
exports.module = new User();
//# sourceMappingURL=index.js.map