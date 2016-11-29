import { EntryService } from '../services';
import { entryActionCreators } from './action-creators';
import { AppActions, TransactionActions } from 'local-flux';

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

    createTag = (tag) => {
        this.dispatch(entryActionCreators.createTag());
        return this.entryService.createTag(tag).then(result =>
            this.dispatch(entryActionCreators.createTagSuccess(result.tag))
        ).catch(reason => this.dispatch(entryActionCreators.createTagError(reason)));
    };

    requestAuthentication = () => {

    };
    getSortedEntries = ({ sortBy }) => {
        this.entryService.getSortedEntries({ sortBy }).then(result =>
            this.dispatch(entryActionCreators.getSortedEntries(result))
        );
    };
    createSavedEntry = (akashaId, entry) => {
        this.entryService.createSavedEntry(akashaId, entry).then(savedEntry =>
            this.dispatch(entryActionCreators.createSavedEntrySuccess(savedEntry))
        ).catch(reason => this.dispatch(entryActionCreators.createSavedEntryError(reason)));
    };
    getSavedEntries = akashaId =>
        this.entryService.getSavedEntries(akashaId).then(entries =>
            this.dispatch(entryActionCreators.getSavedEntriesSuccess(entries))
        ).catch(reason => this.dispatch(entryActionCreators.getSavedEntriesError(reason))
        );

    getProfileEntries = (akashaId, startId, limit = 5) =>
        this.dispatch((dispatch, getState) => {
            const flags = getState().entryState.get('flags');
            if (!flags.get('profileEntriesFetched') || !flags.get('fetchingProfileEntries')) {
                dispatch(entryActionCreators.getProfileEntries({
                    fetchingProfileEntries: true
                }));
                this.entryService.getProfileEntries({
                    akashaId,
                    startId,
                    limit,
                    onSuccess: data =>
                        dispatch(entryActionCreators.getProfileEntriesSuccess(data, {
                            fetchingProfileEntries: true
                        })),
                    onError: error =>
                        dispatch(entryActionCreators.getProfileEntriesError(error, {
                            fetchingProfileEntries: false,
                            profileEntriesFetched: true
                        }))
                });
            }
        });

    entryTagIterator = (tagName, start, limit) => {
        this.dispatch(entryActionCreators.entryTagIterator({ fetchingTagEntries: true }));
        this.entryService.entryTagIterator({
            tagName,
            start,
            limit,
            onSuccess: data => this.dispatch(entryActionCreators.entryTagIteratorSuccess(data, {
                fetchingTagEntries: false
            })),
            onError: error => this.dispatch(entryActionCreators.entryTagIteratorError(error, {
                fetchingTagEntries: false
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

    upvote = (entryId, weight, value, gas) =>
        this.dispatch((dispatch, getState) => {
            const token = getState().profileState.getIn(['loggedProfile', 'token']);
            dispatch(entryActionCreators.upvote({ votePending: { entryId, value: true } }));
            this.entryService.upvote({
                token,
                entryId,
                weight,
                value,
                gas,
                onSuccess: (data) => {
                    const entryTitle = getState().entryState.get('entries')
                        .find(entry => entry.get('entryId') === data.entryId)
                        .getIn(['content', 'content', 'title']);
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'upvote',
                        entryId: data.entryId
                    }]);
                    this.appActions.showNotification({
                        id: 'upvotingEntry',
                        values: { entryTitle }
                    });
                },
                onError: (error, data) =>
                    dispatch(entryActionCreators.upvoteError(error, {
                        votePending: { entryId: data.entryId, value: false }
                    }))
            });
        });

    downvote = (entryId, weight, value, gas) =>
        this.dispatch((dispatch, getState) => {
            const token = getState().profileState.getIn(['loggedProfile', 'token']);
            dispatch(entryActionCreators.downvote({ votePending: { entryId, value: true } }));
            this.entryService.downvote({
                token,
                entryId,
                weight,
                value,
                gas,
                onSuccess: (data) => {
                    const entryTitle = getState().entryState.get('entries')
                        .find(entry => entry.get('entryId') === data.entryId)
                        .getIn(['content', 'content', 'title']);
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'downvote',
                        entryId: data.entryId
                    }]);
                    this.appActions.showNotification({
                        id: 'downvotingEntry',
                        values: { entryTitle }
                    });
                },
                onError: (error, data) =>
                    dispatch(entryActionCreators.downvoteError(error, {
                        votePending: { entryId: data.entryId, value: false }
                    }))
            });
        });

    upvoteSuccess = entryId =>
        this.dispatch((dispatch, getState) => {
            const entryTitle = getState().entryState.get('entries')
                .find(entry => entry.get('entryId') === entryId)
                .getIn(['content', 'content', 'title']);
            dispatch(entryActionCreators.upvoteSuccess({
                votePending: { entryId, value: false }
            }));
            this.appActions.showNotification({
                id: 'upvoteEntrySuccess',
                values: { entryTitle }
            });
        });

    downvoteSuccess = entryId =>
        this.dispatch((dispatch, getState) => {
            const entryTitle = getState().entryState.get('entries')
                .find(entry => entry.get('entryId') === entryId)
                .getIn(['content', 'content', 'title']);
            dispatch(entryActionCreators.downvoteSuccess({
                votePending: { entryId, value: false }
            }));
            this.appActions.showNotification({
                id: 'downvoteEntrySuccess',
                values: { entryTitle }
            });
        });

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
                this.dispatch(entryActionCreators.isActiveSuccess(data, { isActivePending: false })),
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
                this.dispatch(entryActionCreators.getVoteOfSuccess(data, { fetchingVoteOf: false })),
            onError: error =>
                this.dispatch(entryActionCreators.getVoteOfError(error, { fetchingVoteOf: false }))
        });
    }
}
export { EntryActions };
