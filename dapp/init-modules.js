var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jsonSchemaWeb3 from '@akashaproject/jsonschema-web3';
import { CORE_MODULE, GENERAL_SETTINGS } from '@akashaproject/common/constants';
import IpfsConnector from '@akashaproject/ipfs-js-connector';
import core from '@akashaproject/core';
import commonModule from '@akashaproject/common';
import authModule from '@akashaproject/auth-web3';
import commentsModule from '@akashaproject/comments';
import entryModule from '@akashaproject/entry';
import gethModule from '@akashaproject/geth-web3';
import ipfsModule from '@akashaproject/ipfs';
import licencesModule from '@akashaproject/licences';
import notificationsModule from '@akashaproject/notifications';
import pinnerModule from '@akashaproject/pinner';
import profileModule from '@akashaproject/profile';
import registryModule from '@akashaproject/registry';
import searchModule from '@akashaproject/search';
import { init } from '@akashaproject/search/indexes';
import tagsModule from '@akashaproject/tags';
import txModule from '@akashaproject/tx';
import { DEFAULT_IPFS_CONFIG, BASE_URL } from './config/settings';
const bootstrap = function bootstrap(serviceProvider, gS, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        core.init();
        const common = commonModule.init(serviceProvider, gS);
        const auth = authModule.init(serviceProvider, gS);
        const comments = commentsModule.init(serviceProvider, gS);
        const entry = entryModule.init(serviceProvider, gS);
        const geth = gethModule.init(serviceProvider, gS);
        const ipfs = ipfsModule.init(serviceProvider, gS);
        const licences = licencesModule.init(serviceProvider, gS);
        const notifications = notificationsModule.init(serviceProvider, gS);
        const pinner = pinnerModule.init(serviceProvider, gS);
        const profile = profileModule.init(serviceProvider, gS);
        const registry = registryModule.init(serviceProvider, gS);
        const search = searchModule.init(serviceProvider, gS);
        const tags = tagsModule.init(serviceProvider, gS);
        const tx = txModule.init(serviceProvider, gS);
        const serviceValidator = function () {
            return { Validator: jsonSchemaWeb3 };
        };
        const ipfsLogger = logger.child({ module: 'ipfs' });
        IpfsConnector.getInstance().setOption('config', DEFAULT_IPFS_CONFIG);
        IpfsConnector.getInstance().setOption('repo', 'ipfs#akasha-beta');
        gS(CORE_MODULE.IPFS_API).instance = IpfsConnector.getInstance();
        IpfsConnector.getInstance().setLogger(ipfsLogger);
        serviceProvider().service(CORE_MODULE.VALIDATOR_SCHEMA, serviceValidator);
        serviceProvider().service(CORE_MODULE.IPFS_CONNECTOR, function () {
            return IpfsConnector;
        });
        gS(CORE_MODULE.SETTINGS).set(GENERAL_SETTINGS.BASE_URL, BASE_URL);
        const prefix = 'akasha#dapp#0';
        yield init(prefix)
            .then(() => logger.debug('Finished init local db.'))
            .catch(err => logger.error(err));
        return {
            [commonModule.moduleName]: common,
            [authModule.moduleName]: auth,
            [commentsModule.moduleName]: comments,
            [entryModule.moduleName]: entry,
            [gethModule.moduleName]: geth,
            [ipfsModule.moduleName]: ipfs,
            [licencesModule.moduleName]: licences,
            [notificationsModule.moduleName]: notifications,
            [pinnerModule.moduleName]: pinner,
            [profileModule.moduleName]: profile,
            [registryModule.moduleName]: registry,
            [searchModule.moduleName]: search,
            [tagsModule.moduleName]: tags,
            [txModule.moduleName]: tx,
        };
    });
};
export default bootstrap;
//# sourceMappingURL=init-modules.js.map