const { ipcMain } = require('electron');
const MainService = require('./main');
const Dapple = require('../../../contracts.sol/build/js_module.js');
const Promise = require('bluebird');

/**
 * EntryService class
 * It provides the Renderer with functions
 * for publishing stuff
 * a publish JSON payload has to look like this:
 * {
    tags: ['economy', 'politics'],
    entry: {
        title: 'My title',
        summary: 'My summary',
        ...
    }
 }
 */
class EntryService extends MainService {
    /*
     * @returns {EntryService}
     */
    constructor () {
        super('entry');
        this.ADD_TAGS_FAILED = 'Adding tags failed';
        this.NO_TAG_PARAMETER = 'No tag parameter sent';
        this.MAIN_ATTRIBUTES = ['title', 'summary'];
        this.CREATE_ENTRY_CONTRACT_GAS = 2800000;
    }
    /*
     * It sets up the listeners for this module.
     * Events used are:
     * server:ipfs:startService used by the View layer to start the ipfs executable
     *
     * @param {BrowserWindow} mainWindow -- ignored for now
     * @returns undefined
     */
    setupListeners () {
        ipcMain.on(this.serverEvent.publish, (event, arg) => {
            this._publish(event, arg);
        });
        ipcMain.on(this.serverEvent.tagExists, (event, arg) => {
            this._tagExists(event, arg);
        });
        ipcMain.on(this.serverEvent.addTags, (event, arg) => {
            this._tagHandler(event, arg);
        });
        ipcMain.on(this.serverEvent.getTags, (event, arg) => {
            this._getTags(event, arg);
        });
    }

    _tagExists (event, arg) {
        if (arg.tag) {
            const web3 = this.__getWeb3();
            const tagsContract = new Dapple.class(web3).objects.tags;
            tagsContract.exists.call(web3.fromUtf8(arg.tag), {}, (err, res) => {
                if (err) {
                    this._sendEvent(event)(this.clientEvent.tagExists, false, err, err.toString());
                } else {
                    this._sendEvent(event)(this.clientEvent.tagExists, true, {
                        exists: res,
                        tag: arg.tag
                    });
                }
            });
        } else {
            this._sendEvent(event)(this.clientEvent.tagExists, false, {}, this.NO_TAG_PARAMETER);
        }
    }

    _getTags (event, arg) {
        const web3 = this.__getWeb3();
        const tagsContract = new Dapple.class(web3).objects.tags;
        const tags = [];
        tagsContract._length((err, res) => {
            if (err) {
                this._sendEvent(event)(this.clientEvent.getTags, false, err, err.toString());
            } else {
                const numberOfTags = res.toNumber();
                let idx = (typeof arg.position !== 'undefined') ? arg.position : 1;
                for (; idx < numberOfTags - 1; idx++) {
                    tagsContract.getTagAt.call(idx, {}, (serr, sres) => {
                        if (!serr) {
                            tags.push(web3.toUtf8(sres));
                            if (tags.length >= numberOfTags - 1) {
                                this._sendEvent(event)(this.clientEvent.getTags, true, {
                                    tags
                                });
                            }
                        }
                    });
                }
            }
        });
    }

    _tagHandler (event, pubObj) {
        const web3 = this.__getWeb3();
        const tagsContract = new Dapple.class(web3).objects.tags;
        const tagExistsPromises = [];
        const tagExistsPromise = Promise.promisify(tagsContract.exists.call);
        for (const tag of pubObj.tags) {
            tagExistsPromises.push(
                tagExistsPromise(tag).then(((_tag) => {
                    return (exists) => {
                        return { tag: _tag, exists };
                    };
                })(tag))
            );
        }

        Promise.all(tagExistsPromises).then((results) => {
            let idx = 0;
            let numberOfTagsToBeAdded = 0;
            const tagAddedHandler = (tag) => {
                return (err, tx) => {
                    if (err) {
                        this._sendEvent(event)(this.clientEvent.addTags,
                                    false,
                                    err,
                                    this.ADD_TAGS_FAILED
                                    );
                    } else {
                        this._sendEvent(event)(this.clientEvent.addTags,
                                    true,
                                    { tx, tag }
                                    );
                        this.__getGeth().addFilter('tx', tx, () => {
                            idx++;
                            if (idx >= numberOfTagsToBeAdded) {
                                if (pubObj.entry && pubObj.entry.title) {
                                    this._publishArticle(event, pubObj);
                                }
                            }
                        });
                    }
                };
            };
            web3
                .personal
                .unlockAccountAsync(pubObj.account, pubObj.password, this.UNLOCK_INTERVAL)
                .then(() => {
                    for (const result of results) {
                        if (!result.exists) {
                            numberOfTagsToBeAdded++;
                            tagsContract.add(
                                web3.fromUtf8(result.tag),
                                {
                                    from: this._getCoinbase(pubObj)
                                },
                                tagAddedHandler(result.tag));
                        }
                    }
                    if (numberOfTagsToBeAdded === 0) {
                        if (pubObj.entry && pubObj.entry.title) {
                            this._publishArticle(event, pubObj);
                        }
                    }
                }).catch((err) => {
                    this._sendEvent(event)(this.clientEvent.addTags,
                                        false,
                                        err,
                                        this.UNLOCK_COINBASE_FAIL);
                });
        });
    }

    _publish (event, arg) {
        // if (arg.tags && typeof arg.tags === 'object') {
        //     this._tagHandler(event, arg);
        // } else {
            // TODO: maybe we must not publish an article with no tags
        this._publishArticle(event, arg);
        // }
    }

    _publishArticle (event, pubObj) {
        this._sendEvent(event)(this.clientEvent.publish, true, {
            message: pubObj
        });
        const mainObj = {};
        for (const attr of this.MAIN_ATTRIBUTES) {
            mainObj[attr] = pubObj[attr];
        }
        this._addToIpfs({
            data: JSON.stringify(mainObj)
        }).then((response) => {
            const hash = response[0].Hash;
            const web3 = this.__getWeb3();
            web3
                .personal
                .unlockAccountAsync(pubObj.account, pubObj.password, this.UNLOCK_INTERVAL)
                .then(() => {
                    const indexedTagsContract = new Dapple.class(web3).objects.indexedTags;
                    const errorEvent = indexedTagsContract.Error();
                    errorEvent.watch((evtErr, evtRes) => {
                        console.log(require('util').inspect(evtRes.args, false, null));
                        console.log(web3.toUtf8(evtRes.args.method));
                        console.log(web3.toUtf8(evtRes.args.reason));
                        if (!evtErr) {
                            const method = web3.toUtf8(evtRes.args.method);
                            const reason = web3.toUtf8(evtRes.args.reason);
                            console.log(reason);
                            console.log('----------------------');
                            console.log(method);
                        }
                    });
                    const mainContract = new Dapple.class(web3).objects.akashaMain;
                    // const mainErrorEvt = mainContract.Published();
                    // mainErrorEvt.watch((evtErr, evtRes) => {
                    //     if (!evtErr) {
                    //         const method = web3.toUtf8(evtRes.args.method);
                    //         const reason = web3.toUtf8(evtRes.args.reason);
                    //         console.log(reason);
                    //         console.log('----------------------');
                    //         console.log(method);
                    //     }
                    // });
                    return mainContract.publishEntry(
                        this._toBytes32Array(this._chopIpfsHash(hash), web3.fromUtf8),
                        this._toBytes32Array(pubObj.tags, web3.fromUtf8),
                        {
                            from: this._getCoinbase(pubObj),
                            gas: this.CREATE_ENTRY_CONTRACT_GAS
                        },
                        (err, tx) => {
                            if (err) {
                                this._sendEvent(event)(this.clientEvent.publish,
                                            false,
                                            err,
                                            this.PUBLISH_ARTICLE_FAIL);
                            } else {
                                this._sendEvent(event)(this.clientEvent.publish,
                                        true,
                                        Object.assign({ tx }, pubObj));
                                this.__getGeth().addFilter('tx', tx, () => {
                                    // debug and check the .log key
                                    this._sendEvent(event)(this.clientEvent.publish,
                                            true,
                                            Object.assign({ ipfsHash: hash }, pubObj));
                                });
                            }
                        }
                    );
                }).catch((err) => {
                    this._sendEvent(event)(this.clientEvent.signUp,
                                        false,
                                        err,
                                        this.UNLOCK_COINBASE_FAIL);
                });
        });
    }
}

export default EntryService;
