import { hashHistory } from 'react-router';
import throttle from 'lodash.throttle';
import { draftActionCreators } from './action-creators';

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
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.entryService.saveDraft({ authorUsername, ...draft }).then((result) => {
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
            .catch(reason => this.dispatch(draftActionCreators.createDraftError(reason)));
    };

    updateDraft = (changes) => {
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.entryService.saveDraft(changes).then(savedDraft =>
            this.dispatch(draftActionCreators.updateDraftSuccess(savedDraft))
        ).catch(reason => this.dispatch(draftActionCreators.updateDraftError(reason)));
    };

    updateDraftThrottled = (draft) => {
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.throttledUpdateDraft(draft);
    };

    _throttleUpdateDraft = changes =>
        this.entryService.saveDraft(changes).then(savedDraft =>
            this.dispatch(draftActionCreators.updateDraftSuccess(savedDraft))
        ).catch(reason =>
            this.dispatch(draftActionCreators.updateDraftError(reason))
        );

    publishDraft = (entry, profileAddress) => {
        this.entryService.publishEntry(entry, profileAddress).then(response =>
            this.dispatch(draftActionCreators.publishEntrySuccess, response.data)
        ).catch((reason) => {
            console.error(reason, reason.message);
        });
    };

    getDrafts = username =>
        this.entryService.getAllDrafts(username).then(result =>
            this.dispatch(draftActionCreators.getDraftsSuccess(result))
        ).catch(reason => this.dispatch(draftActionCreators.getDraftsError(reason)));

    getDraftsCount = username =>
        this.entryService.getDraftsCount(username).then(result =>
            this.dispatch(draftActionCreators.getDraftsCountSuccess(result))
        ).catch(reason => this.dispatch(draftActionCreators.getDraftsCountError(reason)));

    getDraftById = id =>
        this.entryService.getById('drafts', id).then((result) => {
            this.dispatch(draftActionCreators.getDraftSuccess(result));
            return result;
        }).catch(reason => this.dispatch(draftActionCreators.getDraftError(reason)));
}

export { DraftActions };
