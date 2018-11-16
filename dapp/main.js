var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sp, { getService } from '@akashaproject/core/sp';
import { CORE_MODULE, GETH_MODULE } from '@akashaproject/common/constants';
import initModules from './init-modules';
import registerWeb3Provider from './register-web3-provider';
import * as pino from 'pino';
import startDataStream from './watcher';
let appLogger;
let duplexChannel;
const startApp = (web3, vault) => {
    if (!appLogger || !duplexChannel) {
        throw new Error('Must set appLogger and duplexChannel before starting');
    }
    if (!web3) {
    }
    getService(CORE_MODULE.WEB3_API).instance = web3;
    if (vault.length) {
        getService(CORE_MODULE.WEB3_API).instance.eth.defaultAccount = vault[0];
    }
    console.log(duplexChannel);
    getService(GETH_MODULE.startService).execute().then(() => {
        const contracts = getService(CORE_MODULE.CONTRACTS);
        console.log(contracts, 'contracts');
    });
};
const bootstrapApp = function () {
    return __awaiter(this, void 0, void 0, function* () {
        appLogger = pino({ browser: { asObject: true } });
        if (process.env.AKASHA_LOG_LEVEL) {
            appLogger.level = process.env.AKASHA_LOG_LEVEL;
        }
        else if (!process.env.HOT) {
            appLogger.level = 'error';
        }
        yield initModules(sp, getService, appLogger)
            .then((modules) => {
            appLogger.info('modules inited');
            duplexChannel = startDataStream(modules, 'workerId', getService, appLogger);
            getService(CORE_MODULE.WEB3_HELPER).setChannel(duplexChannel.ipcChannelMain);
            appLogger.info('api listening');
        });
        registerWeb3Provider(startApp);
    });
};
export default bootstrapApp;
//# sourceMappingURL=main.js.map