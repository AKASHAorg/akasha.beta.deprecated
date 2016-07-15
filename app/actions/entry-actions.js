import * as types from '../constants/EntryConstants';
import { EntryService } from '../services';
import { hashHistory } from 'react-router';
import throttle from 'lodash.throttle';
import debug from 'debug';
const dbg = debug('App:EntryActions');

class EntryActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.entryService = new EntryService();
        this.throttledUpdateDraft = throttle(this._throttleUpdateDraft, 2000, {
            trailing: true,
            leading: true
        });
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
                return hashHistory.push(
                    `/${loggedProfile.get('username')}/draft/${savedDraft.id}`
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
        return this.throttledUpdateDraft(draft);
    }
    _throttleUpdateDraft = (draft) => {
        return this.entryService.saveDraft(draft).then(result => {
            dbg('dispatching', types.UPDATE_DRAFT_SUCCESS);
            return this.dispatch({ type: types.UPDATE_DRAFT_SUCCESS, draft: result });
        }).catch(reason =>
            this.dispatch({ type: types.UPDATE_DRAFT_ERROR, error: reason })
        );
    }

    getDrafts = () =>
        this.entryService.getAllDrafts().then(result => {
            dbg('dispatching', types.GET_DRAFTS_SUCCESS, result);
            return this.dispatch({ type: types.GET_DRAFTS_SUCCESS, drafts: result });
        }).catch(reason => this.dispatch({ type: types.GET_DRAFTS_ERROR, error: reason }));

    getDraftById = (id) =>
        this.entryService.getById('drafts', id).then(result => {
            dbg('dispatching', types.GET_DRAFT_SUCCESS, result);
            return this.dispatch({ type: types.GET_DRAFT_SUCCESS, draft: result });
        }).catch(reason => this.dispatch({ type: types.GET_DRAFT_ERROR, error: reason }));
}

export { EntryActions };
