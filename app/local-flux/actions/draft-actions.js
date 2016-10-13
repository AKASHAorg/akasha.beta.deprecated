import { hashHistory } from 'react-router';
import throttle from 'lodash.throttle';
import debug from 'debug';
import { draftActionCreators } from './action-creators';

const dbg = debug('App:EntryActions');
let draftActions = null;

class DraftActions {
    constructor (dispatch) {
        if (!draftActions) {
            draftActions = this;
        }
        this.dispatch = dispatch;
        this.throttledUpdateDraft = throttle(this._throttleUpdateDraft, 2000, {
            trailing: true,
            leading: true
        });
        return draftActions;
    }

    createDraft = (authorUsername, draft) => {
        dbg('dispatching', 'SAVE_DRAFT');
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.entryService.saveDraft({ authorUsername, ...draft }).then((result) => {
            dbg('dispatching ', 'CREATE_DRAFT_SUCCESS', result);
            this.dispatch(draftActionCreators.createDraftSuccess(result));
            return result;
        })
            .then((savedDraft) => {
                this.dispatch(() =>
                    hashHistory.push(
                        `/${authorUsername}/draft/${savedDraft.id}`
                    )
                );
            })
            .catch((reason) => {
                dbg('dispatching', 'CREATE_DRAFT_ERROR', reason);
                return this.dispatch(draftActionCreators.createDraftError(reason));
            });
    };

    updateDraft = (changes) => {
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.entryService.saveDraft(changes).then((savedDraft) => {
            dbg('dispatching', 'UPDATE_DRAFT_SUCCESS', savedDraft);
            return this.dispatch(draftActionCreators.updateDraftSuccess(savedDraft));
        }).catch(reason => this.dispatch(draftActionCreators.updateDraftError(reason)));
    };

    updateDraftThrottled = (draft) => {
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.throttledUpdateDraft(draft);
    };

    _throttleUpdateDraft = changes =>
        this.entryService.saveDraft(changes).then((savedDraft) => {
            dbg('dispatching', 'UPDATE_DRAFT_SUCCESS');
            return this.dispatch(draftActionCreators.updateDraftSuccess(savedDraft));
        }).catch(reason =>
            this.dispatch(draftActionCreators.updateDraftError(reason))
        );

    publishDraft = (entry, profileAddress) => {
        dbg('publish entry', entry);
        this.entryService.publishEntry(entry, profileAddress).then((response) => {
            dbg(response, 'returned from entry publishing');
            return this.dispatch(draftActionCreators.publishEntrySuccess, response.data);
        }).catch((reason) => {
            console.error(reason, reason.message);
        });
    };

    getDrafts = username =>
        this.entryService.getAllDrafts(username).then((result) => {
            dbg('dispatching', 'GET_DRAFTS_SUCCESS', result);
            return this.dispatch(draftActionCreators.getDraftsSuccess(result));
        }).catch(reason => this.dispatch(draftActionCreators.getDraftsError(reason)));

    getDraftsCount = username =>
        this.entryService.getDraftsCount(username).then((result) => {
            dbg('dispatching', 'GET_DRAFTS_COUNT_SUCCESS', result);
            return this.dispatch(draftActionCreators.getDraftsCountSuccess(result));
        }).catch(reason => this.dispatch(draftActionCreators.getDraftsCountError(reason)));

    getDraftById = id =>
        this.entryService.getById('drafts', id).then((result) => {
            dbg('dispatching', 'GET_DRAFT_SUCCESS', result);
            this.dispatch(draftActionCreators.getDraftSuccess(result));
            return result;
        }).catch(reason => this.dispatch(draftActionCreators.getDraftError(reason)));
}

export { DraftActions };
