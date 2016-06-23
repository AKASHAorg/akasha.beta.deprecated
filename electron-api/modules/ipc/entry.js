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
    title: 'My title',
    summary: 'My summary',
    tags: ['economy', 'politics'],
    article: 'The whole article'
 }
 */
class EntryService extends MainService {
    /*
     * @returns {EntryService}
     */
    constructor () {
        super('entry');
        this.ADD_TAGS_FAILED = 'Adding tags failed';
        this.MAIN_ATTRIBUTES = ['title', 'summary'];
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
    }

    _tagHandler (pubObj) {
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
            const tagAddedHandler = (err, tx) => {
                if (err) {
                    this._sendEvent()(this.clientEvent.signUp,
                                false,
                                { err,
                                    message: this.ADD_TAGS_FAILED
                                });
                } else {
                    this.__getGeth().addFilter('tx', tx, () => {
                        idx++;
                        if (idx >= numberOfTagsToBeAdded) {
                            this._publishArticle(pubObj);
                        }
                    });
                }
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
                                {},
                                tagAddedHandler);
                        }
                    }
                }).catch((err) => {
                    this._sendEvent()(this.clientEvent.signUp,
                                        false,
                                        this.UNLOCK_COINBASE_FAIL);
                });
        });
    }

    _publish (event, arg) {
        if (arg.tags && typeof arg.tags === 'object') {
            this._tagHandler(arg);
        } else {
            // TODO: maybe we must not publish an article with no tags
            this._publishArticle(arg);
        }
    }

    _publishArticle (pubObj) {
        this._sendEvent()(this.clientEvent.publish, true, {
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
            const mainContract = new Dapple.class(web3).objects.akashaMain;
            mainContract.publishEntry(
                this._chopIpfsHash(hash),
                pubObj.tags,
                {},
                (err, tx) => {
                    if (err) {
                        this._sendEvent()(this.clientEvent.publish,
                                    false,
                                    { err,
                                        message: this.PUBLISH_ARTICLE_FAIL
                                    });
                    } else {
                        this.__getGeth().addFilter('tx', tx, () => {
                            this._sendEvent()(this.clientEvent.publish,
                                    true,
                                    pubObj);
                        });
                    }
                }
            );
        });
        const web3 = this.__getWeb3();
        web3
            .personal
            .unlockAccountAsync(pubObj.account, pubObj.password, this.UNLOCK_INTERVAL)
            .then(() => {

            }).catch((err) => {
                this._sendEvent()(this.clientEvent.signUp,
                                    false,
                                    this.UNLOCK_COINBASE_FAIL);
            });
    }
}

export default EntryService;
