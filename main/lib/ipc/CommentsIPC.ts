import ModuleEmitter from './event/ModuleEmitter';
import channels from '../channels';
import { constructed as contracts } from './contracts/index';
import { mainResponse } from './event/responses';
import { module as userModule } from './modules/auth/index';
import WebContents = Electron.WebContents;

class CommentsIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'comments';
        this.DEFAULT_MANAGED = ['getScore'];
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this
            ._publish()
            ._update()
            ._upvote()
            ._downvote()
            ._getScore()
            ._getCount()
            ._getCommentAt()
            ._manager();
    }

    private _publish() {
        this.registerListener(
            channels.server[this.MODULE_NAME].publish,
            (event: any, data: CommentPublishRequest) => {
                let response: CommentPublishResponse;
                contracts.instance
                    .main
                    .saveComment(data.address, data.hash, data.gas)
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
                            channels.client[this.MODULE_NAME].publish,
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
            (event: any, data: CommentUpdateRequest) => {
                let response: CommentUpdateResponse;
                contracts.instance
                    .main
                    .updateComment(data.address, data.commentId, data.hash, data.gas)
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
            (event: any, data: CommentVoteRequest) => {
                let response: CommentVoteResponse;
                contracts.instance
                    .main
                    .upVoteComment(data.address, data.weight, data.commentId, data.gas, data.value)
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
            (event: any, data: CommentVoteRequest) => {
                let response: CommentVoteResponse;
                contracts.instance
                    .main
                    .downVoteComment(data.address, data.weight, data.commentId, data.gas, data.value)
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
                            channels.client[this.MODULE_NAME].downvote,
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
            (event: any, data: CommentScoreRequest) => {
                let response: CommentScoreResponse;
                contracts.instance
                    .main
                    .getScoreOfComment(data.address, data.commentId)
                    .then((score: number) => {
                        response = mainResponse({ address: data.address, score });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({ error: { message: err.message } });
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

    private _getCount() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getCount,
            (event: any, data: GetCommentCountRequest) => {
                let response: GetCommentCountResponse;
                contracts.instance
                    .main
                    .getCommentsCount(data.address)
                    .then((count) => {
                        response = mainResponse({ count, address: data.address });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                address: data.address
                            }
                        })
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getCount,
                            response,
                            event
                        )
                    });
            });
        return this;
    }

    private _getCommentAt() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getCommentAt,
            (event: any, data: GetCommentAtRequest) => {
                let response: GetCommentAtResponse;
                contracts.instance
                    .main
                    .getCommentAt(data.address, data.id)
                    .then((mediaObj) => {
                        response = mainResponse({
                            hash: mediaObj._hash,
                            owner: mediaObj._owner,
                            date: mediaObj._date,
                            address: data.address,
                            id: data.id
                        });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                address: data.address,
                                id: data.id
                            }
                        })
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getCommentAt,
                            response,
                            event
                        )
                    });
            });
        return this;
    }
}

export default CommentsIPC;
