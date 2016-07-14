import * as types from '../constants/EntryConstants';
import { EntryService } from '../services';
import { hashHistory } from 'react-router';
import debug from 'debug';
const dbg = debug('App:EntryActions');

class EntryActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.entryService = new EntryService();
    }
    createDraft = (draft) => {
        dbg('dispatching', types.SAVE_DRAFT);
        this.dispatch({ type: types.SAVE_DRAFT, draft });
        return this.entryService.saveDraft(draft).then((result) => {
            dbg('dispatching', types.CREATE_DRAFT_SUCCESS, result);
            this.dispatch({ type: types.CREATE_DRAFT_SUCCESS, draft: result });
            return result;
        })
        .then((savedDraft) => {
            this.dispatch((dispatch, getState) => {
                const loggedProfile = getState().profileState.get('loggedProfile');
                console.log(loggedProfile, savedDraft);
                return hashHistory.push(
                    `/${loggedProfile.get('username')}/drafts/${savedDraft.id}`
                );
            });
        })
        .catch(reason => {
            dbg('dispatching', types.CREATE_DRAFT_ERROR, reason);
            return this.dispatch({ type: types.CREATE_DRAFT_ERROR, error: reason });
        });
    }
    updateDraft = (draft) => {
        this.dispatch({ type: types.SAVE_DRAFT, draft });
        return this.entryService.saveDraft(draft).then(result => {
            dbg('dispatching', types.UPDATE_DRAFT_SUCCESS);
            return this.dispatch({ type: types.UPDATE_DRAFT_SUCCESS, draft: result });
        }).catch(reason => {
            return this.dispatch({ type: types.UPDATE_DRAFT_ERROR, error: reason });
        });
    }
    getDrafts = () => {
        return this.entryService.getAllDrafts().then(result => {
            dbg('dispatching', types.GET_DRAFTS_SUCCESS, result);
            return this.dispatch({ type: types.GET_DRAFTS_SUCCESS, drafts: result });
        }).catch(reason => this.dispatch({ type: types.GET_DRAFTS_ERROR, error: reason }));
    }
}

export { EntryActions };
