import ModuleEmitter from './event/ModuleEmitter';
import channels from '../channels';
import { constructed as contracts } from './contracts/index';
import { mainResponse } from './event/responses';
import { module as userModule } from './modules/auth/index';
import { entries } from './modules/models/records';
import IpfsEntry from './modules/models/Entry';
import WebContents = Electron.WebContents;

class EntryIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'entry';
        this.DEFAULT_MANAGED = ['getVoteEndDate', 'getScore'];
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this
            ._publish()
            ._downvote()
            ._update()
            ._upvote()
            ._isOpenedToVotes()
            ._getVoteOf()
            ._getVoteEndDate()
            ._getScore()
            ._getEntriesCount()
            ._getEntryOf()
            ._getEntry()
            ._manager();
    }

    private _publish() {
        this.registerListener(
            channels.server[this.MODULE_NAME].create,
            (event: any, data: EntryCreateRequest) => {
                let response: EntryCreateResponse;
                const entry = new IpfsEntry();
                entry.create(data.content, data.tags)
                    .then((hash) => {
                        entries.records.set(`f-${hash}`, data);
                        return contracts.instance
                            .main
                            .publishEntry(hash, data.tags, data.gas)
                    })
                    .then((txData: any) => {
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
                            channels.client[this.MODULE_NAME].create,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    private _update() {
        this.registerListener(
            channels.server[this.MODULE_NAME].update,
            (event: any, data: EntryUpdateRequest) => {
                let response: EntryUpdateResponse;
                const entry = new IpfsEntry();
                entry.load(data.hash);
                contracts.instance
                    .main
                    .updateEntry(data.hash, data.address, data.gas)
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
                                from: { address: data.address }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].update,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    private _upvote() {
        this.registerListener(
            channels.server[this.MODULE_NAME].upvote,
            (event: any, data: EntryUpvoteRequest) => {
                let response: EntryUpvoteResponse;
                contracts.instance
                    .main
                    .upVoteEntry(data.address, data.weight, data.gas, data.value)
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
                                from: { address: data.address }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].upvote,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    private _downvote() {
        this.registerListener(
            channels.server[this.MODULE_NAME].downvote,
            (event: any, data: EntryUpvoteRequest) => {
                let response: EntryUpvoteResponse;
                contracts.instance
                    .main
                    .downVoteEntry(data.address, data.weight, data.gas, data.value)
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
                                from: { address: data.address }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].downvote,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    private _isOpenedToVotes() {
        this.registerListener(
            channels.server[this.MODULE_NAME].isOpenedToVotes,
            (event: any, data: EntryOpenedVotesRequest) => {
                let response: EntryOpenedVotesResponse;
                contracts.instance
                    .main
                    .openedToVotes(data.address)
                    .then((status: boolean) => {
                        response = mainResponse({ address: data.address, voting: status });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: { address: data.address }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].isOpenedToVotes,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    private _getVoteOf() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getVoteOf,
            (event: any, data: EntryVoteofRequest) => {
                let response: EntryVoteofResponse;
                contracts.instance
                    .main
                    .getVoteOf(data.profile, data.address)
                    .then((weight: number) => {
                        response = mainResponse({ profile: data.profile, weight });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: { address: data.address, profile: data.profile }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getVoteOf,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    private _getVoteEndDate() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getVoteEndDate,
            (event: any, data: EntryVoteDateRequest) => {
                let response: EntryVoteDateResponse;
                contracts.instance
                    .main
                    .voteEndDate(data.address)
                    .then((endDate: number) => {
                        response = mainResponse({ address: data.address, date: endDate });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: { address: data.address }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getVoteEndDate,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    private _getScore() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getScore,
            (event: any, data: EntryScoreRequest) => {
                let response: EntryScoreResponse;
                contracts.instance
                    .main
                    .getScoreOfEntry(data.address)
                    .then((score: number) => {
                        response = mainResponse({ address: data.address, score });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: { address: data.address }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getScore,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    private _getEntriesCount() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getEntriesCount,
            (event: any, data: EntriesCountRequest) => {
                let response: EntriesCountResponse;
                contracts.instance
                    .main
                    .getEntriesCount(data.profileAddress)
                    .then((score: number) => {
                        response = mainResponse({ profileAddress: data.profileAddress, score });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: { profileAddress: data.profileAddress }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getEntriesCount,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    private _getEntryOf() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getEntryOf,
            (event: any, data: EntriesOfRequest) => {
                let response: EntriesOfResponse;
                contracts.instance
                    .main
                    .getEntryOf(data.profileAddress, data.position)
                    .then((content: any) => {
                        response = mainResponse({ profileAddress: data.profileAddress, content });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: { profileAddress: data.profileAddress }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getEntryOf,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    private _getEntry() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getEntry,
            (event: any, data: EntryGetRequest) => {
                let response: EntryGetResponse;
                contracts.instance
                    .main
                    .getEntry(data.entryAddress)
                    .then((content: any) => {
                        response = mainResponse({ entryAddress: data.entryAddress, content });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: { entryAddress: data.entryAddress }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getEntry,
                            response,
                            event
                        );
                    });
            });
        return this;
    }
}

export default EntryIPC;
