import {GethConnector} from '@akashaproject/geth-connector';
import {module as profileModule} from './modules/profile/index';
import ModuleEmitter from './event/ModuleEmitter';
import {constructed as contracts} from './contracts/index';
import channels from '../channels';
import { mainResponse } from './event/responses';
import WebContents = Electron.WebContents;

class ProfileIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'profile';
        this.DEFAULT_MANAGED = ['getProfileData', 'getMyBalance', 'getIpfs'];
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._getMyBalance()
            ._getProfileData()
            ._getIpfs()
            ._unregister()
            ._manager();
    }

    private _getProfileData() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getProfileData,
            (event: any, data: ProfileDataRequest) => {
                let response: ProfileDataResponse;
                contracts
                    .instance
                    .profile
                    .getIpfs(data.profile)
                    .then((resp: string) => {
                        if (data.full) {
                            return profileModule.helpers.resolveProfile(resp);
                        }
                        return profileModule.helpers.getShortProfile(resp);
                    })
                    .then((resp: IpfsProfileCreateRequest) => {
                        response = mainResponse(resp);
                    })
                    .catch((err: Error) => {
                        response = mainResponse({error: { message: err.message}});
                    })
                    .finally(() => {
                       this.fireEvent(
                           channels.client[this.MODULE_NAME].getProfileData,
                           response,
                           event
                       ) ;
                    });
            }
        );
        return this;
    }

    private _getMyBalance() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getMyBalance,
            (event: any, data: MyBalanceRequest) => {
                let response: MyBalanceResponse;
                const etherBase = (data.etherBase) ? data.etherBase : GethConnector.getInstance().web3.eth.defaultAccount;
                return GethConnector.getInstance()
                    .web3
                    .eth
                    .getBalanceAsync(etherBase)
                    .then((weiAmount: string) => {
                        const unit = (data.unit) ? data.unit : 'ether';
                        const value =  GethConnector.getInstance()
                           .web3
                           .fromWei(weiAmount, unit);
                        if (!etherBase) {
                            throw new Error('No ethereum address specified');
                        }
                        response = mainResponse(value);
                    })
                    .catch((err: Error) => {
                        response = mainResponse({error: {message: err.message}});
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getMyBalance,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    private _getIpfs() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getIpfs,
            (event: any, data: IpfsDataRequest) => {
                let response: IpfsDataResponse;
                const chain = (data.full) ? profileModule.helpers.resolveProfile(data.ipfsHash) :
                    profileModule.helpers.getShortProfile(data.ipfsHash);
                chain.then((resolved: any) => {
                    response = mainResponse(resolved);
                }).catch((err: Error) => {
                    response = mainResponse({error: {message: err.message}});
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getIpfs,
                            response,
                            event
                        );
                    })
                ;
            }
        );
        return this;
    }

    private _unregister() {
        this.registerListener(
            channels.server[this.MODULE_NAME].unregister,
            (event: any, data: MyBalanceRequest) => {
                console.log(process.getProcessMemoryInfo());
            }
        );
        return this;
    }
}

export default ProfileIPC;
