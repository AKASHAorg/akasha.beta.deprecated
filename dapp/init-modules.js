'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const jsonschema_web3_1 = require('@akashaproject/jsonschema-web3');
const constants_1 = require('@akashaproject/common/constants');
const ipfs_js_connector_1 = require('@akashaproject/ipfs-js-connector');
const core_1 = require('@akashaproject/core');
const common_1 = require('@akashaproject/common');
const auth_web3_1 = require('@akashaproject/auth-web3');
const comments_1 = require('@akashaproject/comments');
const entry_1 = require('@akashaproject/entry');
const geth_web3_1 = require('@akashaproject/geth-web3');
const ipfs_1 = require('@akashaproject/ipfs');
const licences_1 = require('@akashaproject/licences');
const notifications_1 = require('@akashaproject/notifications');
const pinner_1 = require('@akashaproject/pinner');
const profile_1 = require('@akashaproject/profile');
const registry_1 = require('@akashaproject/registry');
const search_1 = require('@akashaproject/search');
const indexes_1 = require('@akashaproject/search/indexes');
const tags_1 = require('@akashaproject/tags');
const tx_1 = require('@akashaproject/tx');
const settings_1 = require('./config/settings');
const bootstrap = async function bootstrap(serviceProvider, gS, logger) {
  core_1.default.init();
  const common = common_1.default.init(serviceProvider, gS);
  const auth = auth_web3_1.default.init(serviceProvider, gS);
  const comments = comments_1.default.init(serviceProvider, gS);
  const entry = entry_1.default.init(serviceProvider, gS);
  const geth = geth_web3_1.default.init(serviceProvider, gS);
  const ipfs = ipfs_1.default.init(serviceProvider, gS);
  const licences = licences_1.default.init(serviceProvider, gS);
  const notifications = notifications_1.default.init(serviceProvider, gS);
  const pinner = pinner_1.default.init(serviceProvider, gS);
  const profile = profile_1.default.init(serviceProvider, gS);
  const registry = registry_1.default.init(serviceProvider, gS);
  const search = search_1.default.init(serviceProvider, gS);
  const tags = tags_1.default.init(serviceProvider, gS);
  const tx = tx_1.default.init(serviceProvider, gS);
  const serviceValidator = function () {
    return { Validator: jsonschema_web3_1.default };
  };
  const ipfsLogger = logger.child({ module: 'ipfs' });
  ipfs_js_connector_1.default.getInstance().setOption('config', settings_1.DEFAULT_IPFS_CONFIG);
  ipfs_js_connector_1.default.getInstance().setOption('repo', 'ipfs#akasha-beta');
  gS(constants_1.CORE_MODULE.IPFS_API).instance = ipfs_js_connector_1.default.getInstance();
  ipfs_js_connector_1.default.getInstance().setLogger(ipfsLogger);
  serviceProvider().service(constants_1.CORE_MODULE.VALIDATOR_SCHEMA, serviceValidator);
  serviceProvider().service(constants_1.CORE_MODULE.IPFS_CONNECTOR, function () {
    return ipfs_js_connector_1.default;
  });
  const prefix = 'akasha#dapp#0';
  await indexes_1.init(prefix)
    .then(() => logger.debug('Finished init local db.'))
    .catch(err => logger.error(err));
  return {
    [common_1.default.moduleName]: common,
    [auth_web3_1.default.moduleName]: auth,
    [comments_1.default.moduleName]: comments,
    [entry_1.default.moduleName]: entry,
    [geth_web3_1.default.moduleName]: geth,
    [ipfs_1.default.moduleName]: ipfs,
    [licences_1.default.moduleName]: licences,
    [notifications_1.default.moduleName]: notifications,
    [pinner_1.default.moduleName]: pinner,
    [profile_1.default.moduleName]: profile,
    [registry_1.default.moduleName]: registry,
    [search_1.default.moduleName]: search,
    [tags_1.default.moduleName]: tags,
    [tx_1.default.moduleName]: tx,
  };
};
exports.default = bootstrap;
//# sourceMappingURL=init-modules.js.map