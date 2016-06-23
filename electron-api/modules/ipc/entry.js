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
        const tagsContract = new Dapple.class(web3).objects.tags;
        const tagExistsPromises = [];
        const tagExistsPromise = Promise.promisify(tagsContract.exists.call);
        for (const tag of pubObj) {
            tagExistsPromises.push(
                tagExistsPromise(tag).then(((_tag) => {
                    return (exists) => {
                        return { tag: _tag, exists };
                    };
                })(tag))
            );
        }

        Promise.all(tagExistsPromises).then((results) => {
            const web3 = this.__getWeb3();
            let idx = 0;
            let numberOfTagsToBeAdded = 0;
            for (const result of results) {
                if (!result.exists) {
                    numberOfTagsToBeAdded++;
                    tagsContract.add(
                        web3.fromUtf8(result.tag),
                        {},
                        (err, tx) => {
                            this.__getGeth().addFilter('tx', tx, () => {
                                idx++;
                                if (idx >= numberOfTagsToBeAdded) {
                                    this._publishArticle(pubObj.article);
                                }
                            });
                        });
                }
            }
        });
    }

    _publish (event, arg) {
        if (arg.tags && typeof arg.tags === 'object') {
            this._tagHandler(arg);
        } else {
            this._publishArticle(arg.article);
        }
    }

    _publishArticle (article) {
        ipcMain.send(this.clientEvent.publish, {
            message: article
        });
    }
}

export default EntryService;
