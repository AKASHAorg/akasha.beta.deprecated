import { hashHistory } from 'react-router';
import throttle from 'lodash.throttle';
import debug from 'debug';
import { EntryService, ProfileService } from '../services';
import { entryActionCreators } from './action-creators';

const dbg = debug('App:EntryActions');

let entryActions = null;

class EntryActions {
    constructor (dispatch) {
        if (!entryActions) {
            entryActions = this;
        }
        this.dispatch = dispatch;
        this.entryService = new EntryService();
        this.profileService = new ProfileService();
        this.throttledUpdateDraft = throttle(this._throttleUpdateDraft, 2000, {
            trailing: true,
            leading: true
        });
        return entryActions;
    }
    createDraft = (authorUsername, draft) => {
        dbg('dispatching', 'SAVE_DRAFT');
        this.dispatch(entryActionCreators.startSavingDraft());
        return this.entryService.saveDraft({ authorUsername, ...draft }).then((result) => {
            dbg('dispatching ', 'CREATE_DRAFT_SUCCESS', result);
            this.dispatch(entryActionCreators.createDraftSuccess(result));
            return result;
        })
            .then((savedDraft) => {
                this.dispatch((dispatch, getState) => {
                    return hashHistory.push(
                        `/${authorUsername}/draft/${savedDraft.id}`
                    );
                });
            })
            .catch(reason => {
                dbg('dispatching', 'CREATE_DRAFT_ERROR', reason);
                return this.dispatch(entryActionCreators.createDraftError(reason));
            });
    };
    updateDraft = (changes) => {
        this.dispatch(entryActionCreators.startSavingDraft());
        return this.entryService.saveDraft(changes).then(savedDraft => {
            dbg('dispatching', 'UPDATE_DRAFT_SUCCESS', savedDraft);
            return this.dispatch(entryActionCreators.updateDraftSuccess(savedDraft));
        }).catch(reason => this.dispatch(entryActionCreators.updateDraftError(reason)));
    };

    updateDraftThrottled = (draft) => {
        this.dispatch(entryActionCreators.startSavingDraft());
        return this.throttledUpdateDraft(draft);
    };

    getDrafts = (userName) =>
        this.entryService.getAllDrafts(userName).then(result => {
            dbg('dispatching', 'GET_DRAFTS_SUCCESS', result);
            return this.dispatch(entryActionCreators.getDraftsSuccess(result));
        }).catch(reason => this.dispatch(entryActionCreators.getDraftsError(reason)));

    getDraftsCount = (userName) =>
        this.entryService.getDraftsCount(userName).then(result => {
            dbg('dispatching', 'GET_DRAFTS_COUNT_SUCCESS', result);
            return this.dispatch(entryActionCreators.getDraftsCountSuccess(result));
        }).catch(reason => this.dispatch(entryActionCreators.getDraftsCountError(reason)));

    getEntriesCount = () =>
        this.entryService.getResourceCount('entries').then(result => {
            dbg('dispatching', 'GET_ENTRIES_COUNT_SUCCESS', result);
            return this.dispatch(entryActionCreators.getEntriesCountSuccess(result));
        }).catch(reason => this.dispatch(entryActionCreators.getEntriesCountError(reason)));

    getDraftById = (id) =>
        this.entryService.getById('drafts', id).then(result => {
            dbg('dispatching', 'GET_DRAFT_SUCCESS', result);
            this.dispatch(entryActionCreators.getDraftSuccess(result));
            return result;
        }).catch(reason => this.dispatch(entryActionCreators.getDraftError(reason)));

    getTags = (startingIndex = 0) => {
        this.dispatch(entryActionCreators.getTags());
        return this.entryService.getTags(startingIndex).then(result => {
            dbg('dispatching', 'GET_TAGS_SUCCESS', result);
            return this.dispatch(entryActionCreators.getTagsSuccess(result));
        }).catch(reason => this.dispatch(entryActionCreators.getTagsError(reason)));
    };
    checkTagExistence = (tag) => {
        this.dispatch(entryActionCreators.checkTagExistence());
        return this.entryService.checkTagExistence(tag).then(result => {
            dbg('dispatching', 'CHECK_TAG_EXISTENCE_SUCCESS', result);
            return this.dispatch(entryActionCreators.checkTagExistenceSuccess(result));
        }).catch(reason => this.dispatch(entryActionCreators.checkTagExistenceError(reason)));
    };

    createTag = (tag) => {
        this.dispatch(entryActionCreators.createTag());
        return this.entryService.createTag(tag).then(result => {
            dbg('dispatching', 'CREATE_TAG_SUCCESS', result);
            return this.dispatch(entryActionCreators.createTagSuccess(result.tag));
        }).catch(reason => this.dispatch(entryActionCreators.createTagError(reason)));
    };

    _throttleUpdateDraft = (changes) =>
        this.entryService.saveDraft(changes).then(savedDraft => {
            dbg('dispatching', 'UPDATE_DRAFT_SUCCESS');
            return this.dispatch(entryActionCreators.updateDraftSuccess(savedDraft));
        }).catch(reason =>
            this.dispatch(entryActionCreators.updateDraftError(reason))
        );
    getProfileBalance = (profileAddress) =>
        this.profileService.getProfileBalance(profileAddress);
    publishEntry = (entry, profileAddress) => {
        dbg('publish entry', entry);
        this.entryService.publishEntry(entry, profileAddress).then(response => {
            dbg(response, 'returned from entry publishing');
            return this.dispatch(entryActionCreators.publishEntrySuccess, response.data);
        }).catch(reason => {
            console.error(reason, reason.message);
        });
    };
    requestAuthentication = () => {

    };
    getSortedEntries = ({ sortBy }) => {
        this.entryService.getSortedEntries({ sortBy }).then(result => {
            dbg(result, 'result for sortBy', sortBy);
            return this.dispatch(entryActionCreators.getSortedEntries(result));
        });
    };
    createSavedEntry = (userName, entry) => {
        this.entryService.createSavedEntry(userName, entry).then(savedEntry =>
            this.dispatch(entryActionCreators.createSavedEntrySuccess(savedEntry))
        ).catch(reason => this.dispatch(entryActionCreators.createSavedEntryError(reason)));
    };
    getSavedEntries = (userName) =>
        this.entryService.getSavedEntries(userName).then(entries => {
            dbg('getSavedEntries', entries);
            return this.dispatch(entryActionCreators.getSavedEntriesSuccess(entries));
        }).catch(reason => this.dispatch(entryActionCreators.getSavedEntriesError(reason))
        );

    getEntriesForTag = ({ tagName }) => {
        this.entryService.getEntriesForTag({ tagName });
    };
    castUpvote = (entryAddress, voteWeight) => {
        this.entryService.castUpvote(entryAddress, voteWeight).then(result => {
            if (result.error) {
                return this.dispatch(entryActionCreators.castUpvoteError(result.error));
            }
            return this.dispatch(entryActionCreators.castUpvoteSuccess(result.data));
        });
    };
    castDownvote = (entryAddress, voteWeight) => {};
}
export { EntryActions };
