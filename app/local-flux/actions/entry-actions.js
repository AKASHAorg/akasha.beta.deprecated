import { AppActions, TransactionActions } from 'local-flux';
import { EntryService } from '../services';
import { entryActionCreators } from './action-creators';

let entryActions = null;

class EntryActions {

    constructor (dispatch) { // eslint-disable-line consistent-return
        if (entryActions) {
            return entryActions;
        }
        this.dispatch = dispatch;
        this.appActions = new AppActions(dispatch);
        this.transactionActions = new TransactionActions(dispatch);
        this.entryService = new EntryService();
        entryActions = this;
    }

    getEntriesCount = (akashaId) => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().entryState.get('flags');
            if (!flags.get('fetchingEntriesCount')) {
                dispatch(entryActionCreators.getEntriesCount({
                    fetchingEntriesCount: true
                }));
                this.entryService.getEntriesCount({
                    akashaId,
                    onSuccess: result =>
                        dispatch(entryActionCreators.getEntriesCountSuccess(result, {
                            fetchingEntriesCount: false,
                            entriesCountFetched: true
                        })),
                    onError: reason => dispatch(entryActionCreators.getEntriesCountError(reason, {
                        fetchingEntriesCount: false,
                        entriesCountFetched: true
                    }))
                });
            }
        });
    };

    getTags = (startingIndex = 0) => {
        this.dispatch(entryActionCreators.getTags());
        return this.entryService.getTags(startingIndex).then(result =>
            this.dispatch(entryActionCreators.getTagsSuccess(result))
        ).catch(reason => this.dispatch(entryActionCreators.getTagsError(reason)));
    };

    checkTagExistence = (tag) => {
        this.dispatch(entryActionCreators.checkTagExistence());
        return this.entryService.checkTagExistence(tag).then(result =>
            this.dispatch(entryActionCreators.checkTagExistenceSuccess(result))
        ).catch(reason => this.dispatch(entryActionCreators.checkTagExistenceError(reason)));
    };

    getSortedEntries = ({ sortBy }) => {
        this.entryService.getSortedEntries({ sortBy }).then(result =>
            this.dispatch(entryActionCreators.getSortedEntries(result))
        );
    };
    saveEntry = (akashaId, entryId) => {
        this.dispatch(entryActionCreators.saveEntry({ savingEntry: true }));
        this.entryService.pinEntry({ operation: 1, entryId });
        this.entryService.saveEntry({
            akashaId,
            entry: { entryId },
            onSuccess: savedEntry =>
                this.dispatch(entryActionCreators.saveEntrySuccess(savedEntry, {
                    savingEntry: false
                })),
            onError: error =>
                this.dispatch(entryActionCreators.saveEntryError(error, {
                    savingEntry: false
                }))
        });
    };
    deleteEntry = (akashaId, entryId) => {
        this.dispatch(entryActionCreators.deleteEntry({ deletingEntry: true }));
        this.entryService.pinEntry({ operation: 2, entryId });
        this.entryService.deleteEntry({
            akashaId,
            entryId,
            onSuccess: id =>
                this.dispatch(entryActionCreators.deleteEntrySuccess(id, {
                    deletingEntry: false
                })),
            onError: error =>
                this.dispatch(entryActionCreators.deleteEntryError(error, {
                    deletingEntry: false
                }))
        });
    };
    getSavedEntries = (akashaId) => {
        this.dispatch(entryActionCreators.getSavedEntries({ fetchingSavedEntries: true }));
        this.entryService.getSavedEntries({
            akashaId,
            onSuccess: data =>
                this.dispatch(entryActionCreators.getSavedEntriesSuccess(data, {
                    fetchingSavedEntries: false
                })),
            onError: error =>
                this.dispatch(entryActionCreators.getSavedEntriesError(error, {
                    fetchingSavedEntries: false
                }))
        });
    };

    getSavedEntriesList = limit =>
        this.dispatch((dispatch, getState) => {
            this.dispatch(entryActionCreators.getSavedEntriesList({
                fetchingSavedEntriesList: true
            }));
            const savedEntries = getState().entryState.get('savedEntries');
            const entries = savedEntries.reverse().slice(0, limit).toJS();
            this.entryService.getEntryList({
                entries,
                onSuccess: data =>
                    this.dispatch(entryActionCreators.getSavedEntriesListSuccess(data, {
                        fetchingSavedEntriesList: false
                    })),
                onError: error =>
                    this.dispatch(entryActionCreators.getSavedEntriesListError(error, {
                        fetchingSavedEntriesList: false
                    }))
            });
        });

    moreSavedEntriesList = limit =>
        this.dispatch((dispatch, getState) => {
            if (limit !== 1) {
                this.dispatch(entryActionCreators.moreSavedEntriesList({
                    fetchingMoreSavedEntriesList: true
                }));
            }
            const startIndex = getState().entryState.get('entries').filter(entry =>
                entry.get('type') === 'savedEntry').size;
            const savedEntries = getState().entryState.get('savedEntries');
            const entries = savedEntries.reverse().slice(startIndex, startIndex + limit).toJS();
            this.entryService.moreEntryList({
                entries,
                onSuccess: data =>
                    this.dispatch(entryActionCreators.moreSavedEntriesListSuccess(data, {
                        fetchingMoreSavedEntriesList: false
                    })),
                onError: error =>
                    this.dispatch(entryActionCreators.moreSavedEntriesListError(error, {
                        fetchingMoreSavedEntriesList: false
                    }))
            });
        });

    entryProfileIterator = (akashaId, start, limit = 6) =>
        this.dispatch((dispatch, getState) => {
            const loggedAkashaId = getState().profileState.getIn(['loggedProfile', 'akashaId']);
            dispatch(entryActionCreators.entryProfileIterator({
                fetchingProfileEntries: akashaId !== loggedAkashaId,
                fetchingPublishedEntries: akashaId === loggedAkashaId
            }));
            this.entryService.entryProfileIterator({
                akashaId,
                start,
                limit,
                onSuccess: data =>
                    dispatch(entryActionCreators.entryProfileIteratorSuccess(data, {
                        fetchingProfileEntries: false,
                        fetchingPublishedEntries: false
                    })),
                onError: error =>
                    dispatch(entryActionCreators.entryProfileIteratorError(error, {
                        fetchingProfileEntries: false,
                        fetchingPublishedEntries: false
                    }))
            });
        });

    moreEntryProfileIterator = (akashaId, start, limit = 6) =>
        this.dispatch((dispatch, getState) => {
            const loggedAkashaId = getState().profileState.getIn(['loggedProfile', 'akashaId']);
            this.dispatch(entryActionCreators.moreEntryProfileIterator({
                fetchingMoreProfileEntries: akashaId !== loggedAkashaId,
                fetchingMorePublishedEntries: akashaId === loggedAkashaId
            }));
            this.entryService.moreEntryProfileIterator({
                akashaId,
                start,
                limit,
                onSuccess: data =>
                    this.dispatch(entryActionCreators.moreEntryProfileIteratorSuccess(data, {
                        fetchingMoreProfileEntries: false,
                        fetchingMorePublishedEntries: false
                    })),
                onError: error =>
                    this.dispatch(entryActionCreators.moreEntryProfileIteratorError(error, {
                        fetchingMoreProfileEntries: false,
                        fetchingMorePublishedEntries: false
                    }))
            });
        });

    entryTagIterator = (tagName, start, limit) => {
        this.dispatch((dispatch, getState) => {
            const selectedTag = getState().tagState.get('selectedTag');
            this.dispatch(entryActionCreators.entryTagIterator({ fetchingTagEntries: true }));
            this.entryService.entryTagIterator({
                tagName,
                start,
                limit,
                onSuccess: (data) => {
                    if (selectedTag === data.tagName || !selectedTag) {
                        dispatch(entryActionCreators.entryTagIteratorSuccess(data, {
                            fetchingTagEntries: false
                        }));
                    }
                },
                onError: error => dispatch(entryActionCreators.entryTagIteratorError(error, {
                    fetchingTagEntries: false
                }))
            });
        });
    };

    moreEntryTagIterator = (tagName, start, limit) => {
        this.dispatch(entryActionCreators.moreEntryTagIterator({ fetchingMoreTagEntries: true }));
        this.entryService.moreEntryTagIterator({
            tagName,
            start,
            limit,
            onSuccess: data => this.dispatch(entryActionCreators.moreEntryTagIteratorSuccess(data, {
                fetchingMoreTagEntries: false
            })),
            onError: error => this.dispatch(entryActionCreators.moreEntryTagIteratorError(error, {
                fetchingMoreTagEntries: false
            }))
        });
    };


    getTagEntriesCount = (tagName) => {
        this.dispatch(entryActionCreators.getTagEntriesCount({ fetchingTagEntriesCount: true }));
        this.entryService.getTagEntriesCount({
            tagName,
            onSuccess: data => this.dispatch(entryActionCreators.getTagEntriesCountSuccess(data, {
                fetchingTagEntriesCount: false
            })),
            onError: error => this.dispatch(entryActionCreators.getTagEntriesCountError(error, {
                fetchingTagEntriesCount: false
            }))
        });
    }

    getLicences = () => {
        this.entryService.getLicences({
            onSuccess: ({ licenses }) =>
                this.dispatch(entryActionCreators.getLicencesSuccess(licenses)),
            onError: error => this.dispatch(entryActionCreators.getLicencesError(error))
        });
    };
    getLicenceById = (id) => {
        this.entryService.getLicenceById({
            id,
            onSuccess: ({ license }) =>
                this.dispatch(entryActionCreators.getLicenceByIdSuccess(license)),
            onError: error => this.dispatch(entryActionCreators.getLicenceByIdError(error))
        });
    };

    getEntriesStream = (akashaId) => {
        this.dispatch(entryActionCreators.getEntriesStream({ fetchingEntriesStream: true }));
        this.entryService.getEntriesStream({
            akashaId,
            onSuccess: data =>
                this.dispatch(entryActionCreators.getEntriesStreamSuccess(data, {
                    fetchingEntriesStream: false
                })),
            onError: error =>
                this.dispatch(entryActionCreators.getEntriesStreamError(error, {
                    fetchingEntriesStream: false
                }))
        });
    };

    clearTagEntries = () =>
        this.dispatch(entryActionCreators.clearTagEntries());

    clearSavedEntries = () =>
        this.dispatch(entryActionCreators.clearSavedEntries());

    clearProfileEntries = () =>
        this.dispatch(entryActionCreators.clearProfileEntries());

    addUpvoteAction = payload =>
        this.appActions.addPendingAction({
            type: 'upvote',
            payload,
            gas: 2000000,
            status: 'needWeightConfirmation'
        });

    addDownvoteAction = payload =>
        this.appActions.addPendingAction({
            type: 'downvote',
            payload,
            gas: 2000000,
            status: 'needWeightConfirmation'
        });

    addClaimAction = payload =>
        this.appActions.addPendingAction({
            type: 'claim',
            payload,
            gas: 2000000,
            titleId: 'claimTitle',
            messageId: 'claim',
            status: 'checkAuth'
        });

    voteCost = (weight) => {
        this.dispatch(entryActionCreators.voteCost({
            fetchingVoteCost: true
        }));
        this.entryService.voteCost({
            weight,
            onSuccess: data =>
                this.dispatch(entryActionCreators.voteCostSuccess(data, {
                    fetchingVoteCost: false
                })),
            onError: error =>
                this.dispatch(entryActionCreators.voteCostError(error, {
                    fetchingVoteCost: false
                }))
        });
    };

    upvote = (entryId, entryTitle, weight, value, gas) =>
        this.dispatch((dispatch, getState) => {
            const token = getState().profileState.getIn(['loggedProfile', 'token']);
            dispatch(entryActionCreators.upvote({ votePending: { entryId, value: true } }));
            this.entryService.upvote({
                token,
                entryId,
                extra: { entryTitle },
                weight,
                value,
                gas,
                onSuccess: (data) => {
                    const title = data.extra.entryTitle;
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'upvote',
                        entryId: data.entryId,
                        entryTitle: title
                    }]);
                    this.appActions.showNotification({
                        id: 'upvotingEntry',
                        values: { entryTitle: title },
                        duration: 3000
                    });
                },
                onError: (error, data) =>
                    dispatch(entryActionCreators.upvoteError(error, {
                        votePending: { entryId: data.entryId, value: false }
                    }))
            });
        });

    downvote = (entryId, entryTitle, weight, value, gas) =>
        this.dispatch((dispatch, getState) => {
            const token = getState().profileState.getIn(['loggedProfile', 'token']);
            dispatch(entryActionCreators.downvote({ votePending: { entryId, value: true } }));
            this.entryService.downvote({
                token,
                entryId,
                extra: { entryTitle },
                weight,
                value,
                gas,
                onSuccess: (data) => {
                    const title = data.extra.entryTitle;
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'downvote',
                        entryId: data.entryId,
                        entryTitle: title
                    }]);
                    this.appActions.showNotification({
                        id: 'downvotingEntry',
                        values: { entryTitle: title },
                        duration: 3000
                    });
                },
                onError: (error, data) =>
                    dispatch(entryActionCreators.downvoteError(error, {
                        votePending: { entryId: data.entryId, value: false }
                    }))
            });
        });

    upvoteSuccess = (entryId, entryTitle, minedSuccessfully) => {
        this.dispatch(entryActionCreators.upvoteSuccess({
            votePending: { entryId, value: false }
        }));
        this.appActions.showNotification({
            id: minedSuccessfully ? 'upvoteEntrySuccess' : 'upvoteEntryError',
            values: { entryTitle }
        });
    };

    downvoteSuccess = (entryId, entryTitle, minedSuccessfully) => {
        this.dispatch(entryActionCreators.downvoteSuccess({
            votePending: { entryId, value: false }
        }));
        this.appActions.showNotification({
            id: minedSuccessfully ? 'downvoteEntrySuccess' : 'downvoteEntryError',
            values: { entryTitle }
        });
    };

    getEntry = (entryId, full) => {
        this.dispatch(entryActionCreators.getEntry({ fetchingEntry: true }));
        this.entryService.getEntry({
            entryId,
            full,
            onSuccess: data =>
                this.dispatch(entryActionCreators.getEntrySuccess(data, { fetchingEntry: false })),
            onError: error =>
                this.dispatch(entryActionCreators.getEntryError(error, { fetchingEntry: false }))
        });
    };

    getFullEntry = (entryId, version, full = true) => {
        this.dispatch(entryActionCreators.getFullEntry({ fetchingFullEntry: true }));
        this.entryService.getEntry({
            entryId,
            full,
            version,
            onSuccess: (data) => {
                // @todo: [code: 3ntry3] get rid of this asap!!
                // we need this to load images from ipfs
                window.entry__baseUrl = data.baseUrl;
                this.dispatch(entryActionCreators.getFullEntrySuccess(data, {
                    fetchingFullEntry: false
                }));
            },
            onError: error =>
                this.dispatch(entryActionCreators.getFullEntryError(error, {
                    fetchingFullEntry: false
                }))
        });
    }

    getLatestVersion = (entryId) =>
        this.entryService.getEntry({
            entryId,
            onSuccess: (data) => this.setLatestVersion(data.content.version),
            onError: (error) => this.dispatch(entryActionCreators.getEntryError(error))
        });

    setLatestVersion = (version) => this.dispatch(entryActionCreators.setLatestVersion(version));

    unloadFullEntry = () => {
        this.dispatch(entryActionCreators.unloadFullEntry());
    }

    getScore = (entryId) => {
        this.dispatch(entryActionCreators.getScore({ fetchingScore: true }));
        this.entryService.getScore({
            entryId,
            onSuccess: data =>
                this.dispatch(entryActionCreators.getScoreSuccess(data, { fetchingScore: false })),
            onError: error =>
                this.dispatch(entryActionCreators.getScoreError(error, { fetchingScore: false }))
        });
    };

    isActive = (entryId) => {
        this.dispatch(entryActionCreators.isActive({ isActivePending: true }));
        this.entryService.isActive({
            entryId,
            onSuccess: data =>
                this.dispatch(entryActionCreators.isActiveSuccess(data, {
                    isActivePending: false
                })),
            onError: error =>
                this.dispatch(entryActionCreators.isActiveError(error, { isActivePending: false }))
        });
    };

    getVoteOf = (akashaId, entryId) => {
        this.dispatch(entryActionCreators.getVoteOf({ fetchingVoteOf: true }));
        this.entryService.getVoteOf({
            akashaId,
            entryId,
            onSuccess: data =>
                this.dispatch(entryActionCreators.getVoteOfSuccess(data, {
                    fetchingVoteOf: false
                })),
            onError: error =>
                this.dispatch(entryActionCreators.getVoteOfError(error, { fetchingVoteOf: false }))
        });
    }

    canClaim = (entryId) => {
        this.dispatch(entryActionCreators.canClaim({ canClaimPending: true }));
        this.entryService.canClaim({
            entryId,
            onSuccess: data => this.dispatch(entryActionCreators.canClaimSuccess(data, {
                canClaimPending: false
            })),
            onError: error => this.dispatch(entryActionCreators.canClaimError(error, {
                canClaimPending: false
            }))
        });
    }

    getEntryBalance = (entryId) => {
        this.dispatch(entryActionCreators.getEntryBalance({ fetchingEntryBalance: true }));
        this.entryService.getEntryBalance({
            entryId,
            onSuccess: data => this.dispatch(entryActionCreators.getEntryBalanceSuccess(data, {
                fetchingEntryBalance: false
            })),
            onError: error => this.dispatch(entryActionCreators.getEntryBalanceError(error, {
                fetchingEntryBalance: false
            }))
        });
    }

    claim = (entryId, gas) =>
        this.dispatch((dispatch, getState) => {
            const token = getState().profileState.getIn(['loggedProfile', 'token']);
            dispatch(entryActionCreators.claim({ claimPending: { entryId, value: true } }));
            this.entryService.claim({
                token,
                entryId,
                gas,
                onSuccess: (data) => {
                    const entry = getState().entryState.get('entries')
                        .find(en => en.get('entryId') === data.entryId);
                    const entryTitle = entry ?
                        entry.getIn(['content', 'content', 'title']) :
                        getState().entryState.get('fullEntry').content.title;
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'claim',
                        entryId: data.entryId
                    }]);
                    this.appActions.showNotification({
                        id: 'claiming',
                        values: { entryTitle },
                        duration: 3000
                    });
                },
                onError: (error, data) =>
                    dispatch(entryActionCreators.claimError(error, {
                        claimPending: { entryId: data.entryId, value: false }
                    }))
            });
        });

    claimSuccess = (entryId, minedSuccessfully) =>
        this.dispatch((dispatch, getState) => {
            const entry = getState().entryState.get('entries')
                .find(en => en.get('entryId') === entryId);
            const entryTitle = entry ?
                entry.getIn(['content', 'content', 'title']) :
                getState().entryState.get('fullEntry').content.title;
            dispatch(entryActionCreators.claimSuccess({
                claimPending: { entryId, value: false }
            }));
            this.appActions.showNotification({
                id: minedSuccessfully ? 'claimSuccess' : 'claimError',
                values: { entryTitle }
            });
        });
}
export { EntryActions };
