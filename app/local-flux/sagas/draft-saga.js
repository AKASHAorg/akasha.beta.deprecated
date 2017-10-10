import { call, fork, put, select, takeEvery, takeLatest, take, throttle } from 'redux-saga/effects';
import { DraftJS, editorStateToJSON, editorStateFromRaw } from 'megadraft';
import { Map } from 'immutable';
import { DraftModel } from '../reducers/models';
import { actionChannels, enableChannel } from './helpers';
import { selectToken, selectDraftById } from '../selectors';
import * as types from '../constants';
import * as draftService from '../services/draft-service';
import * as draftActions from '../actions/draft-actions';
import * as actionActions from '../actions/action-actions';
import * as entryActions from '../actions/entry-actions';
import * as actionStatus from '../../constants/action-status';

const { EditorState, SelectionState } = DraftJS;
const { Channel } = self;
/**
 * Draft saga
 */

/**
 * create a new draft in state
 * the trick is to split selectionState from editorState
 * and to keep them synced
 */
function* draftCreate ({ data }) {
    const newEditorState = EditorState.createEmpty();
    const firstKey = newEditorState.getCurrentContent().getFirstBlock().getKey();
    const newSelectionState = SelectionState.createEmpty(firstKey);
    /**
     * create a new editor state with the selection applied
     */
    const editorState = EditorState.acceptSelection(newEditorState, newSelectionState);
    const { content, ...others } = data;
    yield put(draftActions.draftCreateSuccess({
        content: {
            ...content,
            draft: editorState,
            title: '',
            excerpt: '',
        },
        selectionState: newSelectionState,
        ...others
    }));
}

/**
 * get all drafts.
 */
function* draftsGet ({ data }) {
    try {
        const response = yield call([draftService, draftService.draftsGet], data.ethAddress);
        let drafts = new Map();
        if (response.length > 0) {
            response.forEach((draft) => {
                draft.content.draft = editorStateFromRaw(draft.content.draft);
                drafts = drafts.setIn([draft.id], DraftModel.createDraft(draft));
            });
        }
        yield put(draftActions.draftsGetSuccess({ drafts }));
    } catch (ex) {
        console.error(ex);
        yield put(draftActions.draftsGetError({ error: ex }));
    }
}

/**
 * save draft to db every x seconds
 */
function* draftAutoSave ({ data }) {
    yield put(draftActions.draftAutosave(data.draft));
    /**
     * prepare data to save in db
     */
    const dataToSave = Object.assign({}, data.draft.toJS());
    const jsonDraft = JSON.parse(editorStateToJSON(data.draft.content.draft));
    dataToSave.content = data.draft.content.toJS();
    dataToSave.content.draft = jsonDraft;
    dataToSave.tags = data.draft.tags.toJS();

    try {
        const response = yield call([draftService, draftService.draftCreateOrUpdate], { draft: dataToSave });
        yield put(draftActions.draftAutosaveSuccess(response));
    } catch (ex) {
        console.error(ex, 'exception thrown');
        yield put(draftActions.draftAutosaveError(
            { error: ex },
            data.draft.id,
            data.draft.content.title
        ));
    }
}

function* draftUpdate ({ data }) {
    const draftObj = data;
    const draft = data.content.get('draft');
    const selectionState = draft.getSelection();
    yield put(draftActions.draftUpdateSuccess({
        draft: draftObj,
        selectionState
    }));
}

function* draftsGetCount ({ data }) {
    try {
        const response = yield call([draftService, draftService.draftsGetCount], {
            ethAddress: data.ethAddress
        });
        yield put(draftActions.draftsGetCountSuccess({ count: response }));
    } catch (ex) {
        yield put(draftActions.draftsGetCountError({ error: ex }));
    }
}

function* draftDelete ({ data }) {
    try {
        const response = yield call([draftService, draftService.draftDelete], { draftId: data.draftId });
        yield put(draftActions.draftDeleteSuccess({ draftId: response }));
    } catch (ex) {
        yield put(draftActions.draftDeleteError({ error: ex, draftId: data.draftId }));
    }
}

function* draftPublish ({ actionId, draft }) {
    const channel = Channel.server.entry.publish;
    const { id } = draft;
    const draftFromState = yield select(state => selectDraftById(state, id));
    const token = yield select(selectToken);
    const draftToPublish = draftFromState.toJS();
    draftToPublish.content.draft = JSON.parse(
        editorStateToJSON(draftFromState.getIn(['content', 'draft']))
    );
    if (draftToPublish.entryType === 'article') {
        draftToPublish.entryType = 1;
    }
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield call([channel, channel.send], {
        actionId,
        id,
        token,
        tags: draftToPublish.tags,
        content: draftToPublish.content,
        entryType: draftToPublish.entryType,
    });
}

function* draftPublishUpdate ({ actionId, draft }) {
    const channel = Channel.server.entry.editEntry;
    const { id } = draft;
    const draftFromState = yield select(state => selectDraftById(state, id));
    const token = yield select(selectToken);
    const draftToPublish = draftFromState.toJS();
    draftToPublish.content.draft = JSON.parse(
        editorStateToJSON(draftFromState.getIn(['content', 'draft']))
    );
    delete draftToPublish.content.featuredImage;
    yield call(enableChannel, channel, Channel.client.entry.manager);
    yield call([channel, channel.send], {
        actionId,
        entryId: id,
        token,
        tags: draftToPublish.tags,
        content: draftToPublish.content,
    });
}

function* draftPublishUpdateSuccess ({ data }) {
    const { id } = data.draft;
    yield put(entryActions.entryGetFull({
        entryId: id,
        asDraft: true
    }));
    yield call([draftService, draftService.draftDelete], { draftId: id });
}

function* draftRevert ({ data }) {
    const { version, id } = data;
    const channel = Channel.server.entry.getEntry;
    try {
        yield call([draftService, draftService.draftDelete], { draftId: id });
        yield call(enableChannel, channel, Channel.client.entry.manager);
        yield call([channel, channel.send], {
            entryId: id,
            version,
            full: true
        });
    } catch (ex) {
        console.error(ex);
    }
}

function* watchDraftPublishChannel () {
    while (true) {
        const response = yield take(actionChannels.entry.publish);
        if (response.error) {
            yield put(draftActions.draftPublishError(
                response.error,
                response.request.id,
                response.request.content.title
            ));
        } else {
            yield put(actionActions.actionUpdate({
                id: response.request.actionId,
                status: actionStatus.publishing,
                tx: response.data.tx,
            }));
        }
    }
}

function* watchDraftPublishUpdateChannel () {
    while (true) {
        const response = yield take(actionChannels.entry.editEntry);
        if (response.error) {
            yield put(draftActions.draftPublishUpdateError(
                response.error,
                response.request.id,
                response.request.content.title
            ));
        } else {
            yield put(actionActions.actionUpdate({
                id: response.request.actionId,
                status: actionStatus.publishing,
                tx: response.data.tx,
            }));
        }
    }
}

function* registerChannelListeners () {
    yield fork(watchDraftPublishChannel);
    yield fork(watchDraftPublishUpdateChannel);
}

export function* watchDraftActions () {
    yield fork(registerChannelListeners);
    yield takeEvery(types.DRAFT_CREATE, draftCreate);
    yield takeEvery(types.DRAFT_PUBLISH, draftPublish);
    yield takeEvery(types.DRAFT_PUBLISH_UPDATE, draftPublishUpdate);
    yield takeEvery(types.DRAFT_PUBLISH_UPDATE_SUCCESS, draftPublishUpdateSuccess);
    yield takeEvery(types.DRAFT_REVERT_TO_VERSION, draftRevert);
    yield takeEvery(types.DRAFT_UPDATE, draftUpdate);
    yield throttle(2000, types.DRAFT_UPDATE_SUCCESS, draftAutoSave);
    yield takeLatest(types.DRAFTS_GET, draftsGet);
    yield takeLatest(types.DRAFTS_GET_COUNT, draftsGetCount);
    yield takeEvery(types.DRAFT_DELETE, draftDelete);
}
