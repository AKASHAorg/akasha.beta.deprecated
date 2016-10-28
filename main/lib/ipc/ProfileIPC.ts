import { GethConnector } from '@akashaproject/geth-connector';
import { module as userModule } from './modules/auth/index';
import { module as profileModule } from './modules/profile/index';
import ModuleEmitter from './event/ModuleEmitter';
import { constructed as contracts } from './contracts/index';
import channels from '../channels';
import { generalSettings, BASE_URL } from './config/settings';
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
            ._follow()
            ._getFollowers()
            ._getFollowersCount()
            ._getFollowing()
            ._getFollowingCount()
            ._updateProfileData()
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
                            return profileModule.helpers.resolveProfile(resp, data.resolveImages);
                        }
                        return profileModule.helpers.getShortProfile(resp, data.resolveImages);
                    })
                    .then((resp: IpfsProfileCreateRequest) => {
                        const constructed = Object.assign(
                            { username: '', [BASE_URL]: generalSettings.get(BASE_URL) },
                            resp,
                            { profile: data.profile }
                        );
                        return contracts.instance
                            .registry
                            .getByContract(data.profile)
                            .then((username) => {
                                constructed.username = username;
                                response = mainResponse(constructed);
                                return response;
                            });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: data.profile
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getProfileData,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    private _updateProfileData() {
        this.registerListener(
            channels.server[this.MODULE_NAME].updateProfileData,
            (event: any, data: ProfileUpdateRequest) => {
                let response: ProfileUpdateResponse;
                profileModule
                    .helpers
                    .create(data.ipfs)
                    .then((ipfsHash: string) => {
                        return contracts.instance
                            .registry
                            .getMyProfile()
                            .then((address: string) => {
                                if(!address){
                                    throw new Error('No profile found to update');
                                }
                                return contracts
                                    .instance
                                    .profile
                                    .updateHash(ipfsHash, address, data.gas)
                            });
                    })
                    .then((txData: any) => {
                        return userModule.auth.signData(txData, data.token);
                    })
                    .then((tx: string) => {
                        response = mainResponse({ tx });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: data.ipfs
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].updateProfileData,
                            response,
                            event
                        );
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
                        const value = GethConnector.getInstance()
                            .web3
                            .fromWei(weiAmount, unit);
                        if (!etherBase) {
                            throw new Error('No ethereum address specified');
                        }
                        response = mainResponse({value: value.toString(10), unit});
                    })
                    .catch((err: Error) => {
                        response = mainResponse({ error: { message: err.message } });
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
                const chain = (data.full) ? profileModule.helpers.resolveProfile(data.ipfsHash, data.resolveImages) :
                    profileModule.helpers.getShortProfile(data.ipfsHash, data.resolveImages);
                chain.then((resolved: any) => {
                    const constructed = Object.assign({[BASE_URL]: generalSettings.get(BASE_URL)}, resolved);
                    response = mainResponse(constructed);
                }).catch((err: Error) => {
                    response = mainResponse({ error: { message: err.message } });
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
            (event: any, data: ProfileUnregisterRequest) => {
                let response: any;
                contracts
                    .instance
                    .profile
                    .unregister(data.profileAddress)
                    .then((txData) => {
                        return userModule.auth.signData(txData, data.token);
                    })
                    .then((tx: string) => {
                        response = mainResponse({ tx });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({ error: { message: err.message } });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].unregister,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    private _follow() {
        this.registerListener(
            channels.server[this.MODULE_NAME].follow,
            (event: any, data: ProfileFollowRequest) => {
                let response: ProfileFollowResponse;
                contracts.instance
                    .main
                    .follow(data.profileAddress)
                    .then((txData) => {
                        return userModule.auth.signData(txData, data.token);
                    })
                    .then((tx: string) => {
                        response = mainResponse({ tx });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({ error: { message: err.message } });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].follow,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    private _getFollowersCount() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getFollowersCount,
            (event: any, data: GetFollowerCountRequest) => {
                let response;
                contracts.instance.main.getFollowersCount(data.profileAddress)
                    .then((count: any) => {
                        response = mainResponse({ count });
                    }).catch((err: Error) => {
                    response = mainResponse({ error: { message: err.message } });
                })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getFollowersCount,
                            response,
                            event
                        );
                    })
                ;
            }
        );
        return this;
    }

    private _getFollowingCount() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getFollowingCount,
            (event: any, data: GetFollowerCountRequest) => {
                let response;
                contracts.instance.main.getFollowingCount(data.profileAddress)
                    .then((count: any) => {
                        response = mainResponse({ count });
                    }).catch((err: Error) => {
                    response = mainResponse({ error: { message: err.message } });
                })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getFollowingCount,
                            response,
                            event
                        );
                    })
                ;
            }
        );
        return this;
    }

    private _getFollowers() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getFollowers,
            (event: any, data: GetFollowersRequest) => {
                let response: GetFollowersResponse;
                contracts.instance.main.getFollowersCount(data.profileAddress)
                    .then((count: any) => {
                        const followers = [];
                        const start = (data.from) ? data.from : 0;
                        const stop = (data.to) ? (data.to < count) ? data.to : count : count;
                        for (let i = start; i < stop; i++) {
                            followers.push(
                                contracts.instance
                                    .main
                                    .getFollowerAt(data.profileAddress, i)
                            )
                        }
                        return Promise.all(followers);
                    }).then((followers: string[]) => {
                    response = mainResponse({
                        followers,
                        from: data.from,
                        to: data.to,
                        profileAddress: data.profileAddress
                    });
                }).catch((err: Error) => {
                    response = mainResponse({
                        error: {
                            message: err.message,
                            from: data.profileAddress
                        }
                    });
                })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getFollowers,
                            response,
                            event
                        );
                    })
                ;
            }
        );
        return this;
    }

    private _getFollowing() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getFollowers,
            (event: any, data: GetFollowersRequest) => {
                let response: GetFollowingResponse;
                contracts.instance.main.getFollowingCount(data.profileAddress)
                    .then((count: any) => {
                        const following = [];
                        const start = (data.from) ? data.from : 0;
                        const stop = (data.to) ? (data.to < count) ? data.to : count : count;
                        for (let i = start; i < stop; i++) {
                            following.push(
                                contracts.instance
                                    .main
                                    .getFollowingAt(data.profileAddress, i)
                            )
                        }
                        return Promise.all(following);
                    })
                    .then((following: string[]) => {
                        response = mainResponse({
                            following,
                            from: data.from,
                            to: data.to,
                            profileAddress: data.profileAddress
                        });
                    }).catch((err: Error) => {
                    response = mainResponse({
                        error: {
                            message: err.message,
                            from: data.profileAddress
                        }
                    });
                })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getFollowing,
                            response,
                            event
                        );
                    })
                ;
            }
        );
        return this;
    }
}

export default ProfileIPC;
