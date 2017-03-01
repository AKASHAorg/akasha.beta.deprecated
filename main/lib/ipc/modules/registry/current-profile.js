"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geth_connector_1 = require("@akashaproject/geth-connector");
const resolve_ethaddress_1 = require("./resolve-ethaddress");
const execute = () => resolve_ethaddress_1.default.execute({ ethAddress: geth_connector_1.GethConnector.getInstance().web3.eth.defaultAccount });
exports.default = { execute, name: 'getCurrentProfile' };
//# sourceMappingURL=current-profile.js.map