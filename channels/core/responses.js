"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    class GethStatus {
        constructor() {
            this.shouldLogout = false;
            this.shouldUnlockVault = false;
        }
        get process() {
            return this.gethProcess;
        }
        set process(status) {
            this.gethProcess = status;
        }
        get api() {
            return this.gethApi;
        }
        set api(status) {
            this.gethApi = status;
        }
        get networkID() {
            return this.gethNetworkID;
        }
        set networkID(id) {
            this.gethNetworkID = id;
        }
        get version() {
            return this.gethVersion;
        }
        set version(nr) {
            this.gethVersion = nr;
        }
        get ethKey() {
            getService(constants_1.CORE_MODULE.WEB3_API).instance.eth.getAccounts((err, accList) => {
                if (err) {
                    throw err;
                }
                if (accList[0] !== this.gethKey) {
                    console.log('default account changed');
                    if (this.gethKey) {
                        location.reload();
                    }
                    if (!accList[0]) {
                        this.shouldUnlockVault = true;
                    }
                    this.gethKey = accList[0];
                    if (this.shouldUnlockVault && this.gethKey) {
                        this.shouldUnlockVault = false;
                    }
                    this.shouldLogout = true;
                }
            });
            return this.gethKey;
        }
        set ethKey(address) {
            this.gethKey = address;
        }
        get akashaKey() {
            return this.gethAkashaKey;
        }
        set akashaKey(address) {
            this.gethAkashaKey = address;
        }
    }
    const gethStatus = new GethStatus();
    const mainResponse = (rawData, request) => {
        const generalSettings = getService(constants_1.CORE_MODULE.SETTINGS).get(constants_1.GENERAL_SETTINGS.OP_WAIT_TIME);
        if (rawData.error) {
            return {
                data: {},
                services: {
                    ipfs: Object.assign(getService(constants_1.CORE_MODULE.IPFS_API).instance.serviceStatus, {
                        [constants_1.GENERAL_SETTINGS.BASE_URL]: generalSettings.get(constants_1.GENERAL_SETTINGS.BASE_URL),
                    }),
                    geth: {
                        process: gethStatus.process,
                        api: gethStatus.api,
                        networkID: gethStatus.networkID,
                        ethAddress: gethStatus.ethKey,
                        version: gethStatus.version,
                        shouldLogout: gethStatus.shouldLogout,
                        shouldUnlockVault: gethStatus.shouldUnlockVault,
                    },
                },
                error: { message: rawData.error.message }, request,
            };
        }
        return {
            data: rawData,
            services: {
                ipfs: Object.assign(getService(constants_1.CORE_MODULE.IPFS_API).instance.serviceStatus, { [constants_1.GENERAL_SETTINGS.BASE_URL]: generalSettings.get(constants_1.GENERAL_SETTINGS.BASE_URL) }),
                geth: {
                    process: gethStatus.process,
                    api: gethStatus.api,
                    networkID: gethStatus.networkID,
                    ethAddress: gethStatus.ethKey,
                    version: gethStatus.version,
                    shouldLogout: gethStatus.shouldLogout,
                    shouldUnlockVault: gethStatus.shouldUnlockVault,
                },
            }, request,
        };
    };
    const emitResponse = { gethStatus, mainResponse };
    const service = function () { return emitResponse; };
    sp().service(constants_1.CORE_MODULE.RESPONSES, service);
}
exports.default = init;
//# sourceMappingURL=responses.js.map