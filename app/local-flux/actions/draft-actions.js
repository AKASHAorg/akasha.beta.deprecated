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
    resumeDraftPublishing = (draft) => {
        /**
         * Steps:
         * 1. Verify logged profile
         * 2. Verify balance
         * 3. Verify tag existence
         * 4. Publish tags
         * 5. Listen mined tx for tags
         * 6. Publish entry
         * 7. Listen mined tx for entry
         */
        console.info('resuming draft publishing', draft);
    }
    createDraftSync = (username, draft) => {
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.draftService.saveDraft({ username, ...draft }).then((result) => {
            this.dispatch(draftActionCreators.createDraftSuccess(result));
            return result;
        }).catch(reason => this.dispatch(draftActionCreators.createDraftError(reason)));
    };

    updateDraft = (changes) => {
        this.dispatch(draftActionCreators.startSavingDraft());
        return this.draftService.saveDraft(changes).then((savedDraft) => {
            this.dispatch(draftActionCreators.updateDraftSuccess(savedDraft));
            return savedDraft;
        }).catch(reason => this.dispatch(draftActionCreators.updateDraftError(reason)));
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

    getDraftsCount = (username) => {
        this.dispatch(draftActionCreators.getDraftsCount());
        this.draftService.getDraftsCount({
            username,
            onSuccess: result => this.dispatch(draftActionCreators.getDraftsCountSuccess(result)),
            onError: reason => this.dispatch(draftActionCreators.getDraftsCountError(reason))
        });
    }

    getDraftById = id =>
        this.draftService.getById('drafts', id).then((result) => {
            this.dispatch(draftActionCreators.getDraftByIdSuccess(result));
            return result;
        }).catch(reason => this.dispatch(draftActionCreators.getDraftByIdError(reason)));

    getPublishingDrafts = username =>
        this.draftservice.getPublishingDrafts({
            username,
            onSuccess: data => this.dispatch(draftActionCreators.getPublishingDraftsSuccess(data)),
            onError: error => this.dispatch(draftActionCreators.getPublishingDraftsError(error))
        });
}

export { DraftActions };
