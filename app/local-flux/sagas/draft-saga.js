import { call, fork, put, select, takeEvery, takeLatest, take, throttle } from 'redux-saga/effects';
import { DraftJS, editorStateToJSON, editorStateFromRaw } from 'megadraft';
import { Map } from 'immutable';
import { DraftModel } from '../reducers/models';
import { actionChannels, enableChannel } from './helpers';
import { selectToken, selectDraftById, selectLoggedEthAddress } from '../selectors';
import { entryTypes } from '../../constants/entry-types';
import * as types from '../constants';
import * as draftService from '../services/draft-service';
import * as draftActions from '../actions/draft-actions';
import * as actionActions from '../actions/action-actions';
import * as entryActions from '../actions/entry-actions';
import * as actionStatus from '../../constants/action-status';
import * as eProcActions from '../actions/external-process-actions';

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
    if (draftObj.get('entryType') !== 'link') {
        const selectionState = draft.getSelection();
        yield put(draftActions.draftUpdateSuccess({
            draft: draftObj,
            selectionState
        }));
    } else {
        yield put(draftActions.draftUpdateSuccess({
            draft: draftObj
        }));
    }
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

    draftToPublish.entryType = entryTypes.findIndex(type => type === draftToPublish.entryType);

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

function* draftPublishSuccess ({ data }) {
    const ethAddress = yield select(selectLoggedEthAddress);
    yield put(draftActions.draftDelete({ draftId: data.draft.id }));
    yield put(entryActions.entryProfileIterator({
        column: null,
        ethAddress,
        limit: 1000000,
        asDrafts: true
    }));
}

function* draftPublishUpdate ({ actionId, draft }) {
    const channel = Channel.server.entry.editEntry;
    const { id } = draft;
    const draftFromState = yield select(state => selectDraftById(state, id));
    const token = yield select(selectToken);
    const ethAddress = yield select(selectLoggedEthAddress);
    const draftToPublish = draftFromState.toJS();
    draftToPublish.content.draft = JSON.parse(
        editorStateToJSON(draftFromState.getIn(['content', 'draft']))
    );
    yield call(enableChannel, channel, Channel.client.entry.manager);
    console.log('sending to main:', {
        ethAddress,
        actionId,
        entryId: id,
        token,
        tags: draftToPublish.tags,
        content: draftToPublish.content
    });
    yield call([channel, channel.send], {
        ethAddress,
        actionId,
        entryId: id,
        token,
        tags: draftToPublish.tags,
        content: draftToPublish.content,
    });
}

function* draftRevert ({ data }) {
    const { id } = data;
    try {
        const resp = yield call([draftService, draftService.draftDelete], { draftId: id });
        yield put(draftActions.draftRevertToVersionSuccess({ ...resp, id }));
    } catch (ex) {
        yield put(draftActions.draftRevertToVersionError({ error: ex }));
    }
}

function* watchDraftPublishChannel () {
    while (true) {
        const response = yield take(actionChannels.entry.publish);
        if (response.error) {
            yield put(draftActions.draftPublishError(
                response.error,
                response.request.id
            ));
        } else if (response.data.receipt) {
            const { blockNumber, cumulativeGasUsed, success } = response.data.receipt;
            if (!response.data.receipt.success) {
                yield put(draftActions.draftPublishError({}, response.request.id));
            } else {
                yield put(eProcActions.gethGetStatusSuccess({
                    blockNr: blockNumber
                }, {
                    geth: {}
                }));
                yield put(actionActions.actionUpdate({
                    id: response.request.actionId,
                    status: actionStatus.published,
                    tx: response.data.tx,
                    blockNumber,
                    cumulativeGasUsed,
                    success,
                    payload: { entryId: response.data.entryId }
                }));
            }
        } else {
            const loggedEthAddress = yield select(selectLoggedEthAddress);
            yield put(actionActions.actionUpdate({
                id: response.request.actionId,
                status: actionStatus.publishing,
                tx: response.data.tx,
                payload: { ethAddress: loggedEthAddress }
            }));
        }
    }
}

function* watchDraftPublishUpdateChannel () {
    while (true) {
        const response = yield take(actionChannels.entry.editEntry);
        console.log(response, 'update entry response');
        if (response.error) {
            yield put(draftActions.draftPublishUpdateError(
                response.error,
                response.request.id
            ));
        } else if (response.data.receipt) {
            const { blockNumber, cumulativeGasUsed, success } = response.data.receipt;
            if (!response.data.receipt.success) {
                yield put(draftActions.draftPublishUpdateError({}, response.request.id));
            } else {
                yield put(eProcActions.gethGetStatusSuccess({
                    blockNr: blockNumber
                }, {
                    geth: {}
                }));
                yield put(actionActions.actionUpdate({
                    id: response.request.actionId,
                    status: actionStatus.published,
                    tx: response.data.tx,
                    blockNumber,
                    cumulativeGasUsed,
                    success,
                }));
            }
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
    yield takeEvery(types.DRAFT_PUBLISH_SUCCESS, draftPublishSuccess);
    yield takeEvery(types.DRAFT_PUBLISH_UPDATE, draftPublishUpdate);
    yield takeEvery(types.DRAFT_PUBLISH_UPDATE_SUCCESS, draftPublishSuccess);
    yield takeEvery(types.DRAFT_REVERT_TO_VERSION, draftRevert);
    yield takeEvery(types.DRAFT_UPDATE, draftUpdate);
    yield throttle(2000, types.DRAFT_UPDATE_SUCCESS, draftAutoSave);
    yield takeLatest(types.DRAFTS_GET, draftsGet);
    yield takeLatest(types.DRAFTS_GET_COUNT, draftsGetCount);
    yield takeEvery(types.DRAFT_DELETE, draftDelete);
}
