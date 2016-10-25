import { hashHistory } from 'react-router';
import { draftActionCreators } from './action-creators';
import { DraftService } from '../services';

let draftActions = null;

class DraftActions {
    constructor (dispatch) {
        if (!draftActions) {
            draftActions = this;
        }
        this.dispatch = dispatch;
        this.draftService = new DraftService();
        return draftActions;
    }

    createDraftSync = (authorUsername, draft) => {
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.draftService.saveDraft({ authorUsername, ...draft }).then((result) => {
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
        return this.draftService.saveDraft(changes).then(savedDraft =>
            this.dispatch(draftActionCreators.updateDraftSuccess(savedDraft))
        ).catch(reason => this.dispatch(draftActionCreators.updateDraftError(reason)));
    };

    updateDraftThrottled = (draft) => {
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.throttledUpdateDraft(draft);
    };

    publishDraft = (entry, profileAddress) => {
        this.draftService.publishEntry(entry, profileAddress).then(response =>
            this.dispatch(draftActionCreators.publishEntrySuccess, response.data)
        ).catch((reason) => {
            console.error(reason, reason.message);
        });
    };

    getDrafts = username =>
        this.draftService.getAllDrafts(username).then(result =>
            this.dispatch(draftActionCreators.getDraftsSuccess(result))
        ).catch(reason => this.dispatch(draftActionCreators.getDraftsError(reason)));

    getDraftsCount = username =>
        this.draftService.getDraftsCount(username).then(result =>
            this.dispatch(draftActionCreators.getDraftsCountSuccess(result))
        ).catch(reason => this.dispatch(draftActionCreators.getDraftsCountError(reason)));

    getDraftById = id =>
        this.draftService.getById('drafts', id).then((result) => {
            this.dispatch(draftActionCreators.getDraftSuccess(result));
            return result;
        }).catch(reason => this.dispatch(draftActionCreators.getDraftError(reason)));
}

export { DraftActions };
