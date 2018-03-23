import { call, fork, put, select, takeEvery, takeLatest, take, throttle } from 'redux-saga/effects';
import { DraftJS, editorStateToJSON, editorStateFromRaw } from 'megadraft';
import { Map, OrderedMap } from 'immutable';
import { isEmpty } from 'ramda';
import { DraftModel } from '../reducers/models';
import { actionChannels, enableChannel, isLoggedProfileRequest } from './helpers';
import { selectToken, selectDraftById, selectLoggedEthAddress } from '../selectors';
import { entryTypes } from '../../constants/entry-types';
import { getWordCount, extractExcerpt } from '../../utils/dataModule';
import { extractImageFromContent } from '../../utils/imageUtils';
import * as types from '../constants';
import * as draftService from '../services/draft-service';
import * as draftActions from '../actions/draft-actions';
import * as actionActions from '../actions/action-actions';
import * as appActions from '../actions/app-actions';
import * as entryActions from '../actions/entry-actions';
import * as actionStatus from '../../constants/action-status';
import * as eProcActions from '../actions/external-process-actions';
import * as tagActions from '../actions/tag-actions';

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

function* draftAddTag ({ data }) {
    yield put(tagActions.tagExists({ tagName: data.tagName, addToDraft: true, draftId: data.draftId }));
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
                let draftTags = new OrderedMap();
                let draftRecord = DraftModel.createDraft(draft);
                draftRecord = draftRecord.setIn(
                    ['content', 'draft'],
                    editorStateFromRaw(draft.content.draft)
                );
                if (Object.keys(draft.tags).length) {
                    Object.keys(draft.tags).forEach((tagKey) => {
                        draftTags = draftTags.set(tagKey, draft.tags[tagKey]);
                    });
                }
                draftRecord = draftRecord.set('tags', draftTags);
                drafts = drafts.set(draft.id, draftRecord);
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
    if (draftObj.getIn(['content', 'entryType']) !== 'link') {
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
/* eslint-disable max-statements */
function* draftPublish ({ actionId, draft }) {
    const channel = Channel.server.entry.publish;
    const { id } = draft;
    const draftFromState = yield select(state => selectDraftById(state, id));
    const token = yield select(selectToken);
    const draftToPublish = draftFromState.toJS();
    try {
        draftToPublish.content.draft = JSON.parse(
            editorStateToJSON(draftFromState.getIn(['content', 'draft']))
        );
        draftToPublish.content.wordCount = getWordCount(draftFromState.content.draft.getCurrentContent());
        if (draftToPublish.content.entryType === 'link' && draftToPublish.content.excerpt.length === 0) {
            draftToPublish.content.excerpt = draftToPublish.content.cardInfo.title;
        }
        yield call(enableChannel, channel, Channel.client.entry.manager);
        if (
            draftToPublish.content.entryType === 'article' &&
            isEmpty(draftToPublish.content.featuredImage)
        ) {
            draftToPublish.content.featuredImage = extractImageFromContent(draftToPublish.content.draft);
        }
        if (
            draftToPublish.content.entryType === 'article' &&
            isEmpty(draftToPublish.content.excerpt)
        ) {
            draftToPublish.content.excerpt = extractExcerpt(draftToPublish.content.draft);
        }
        yield call([channel, channel.send], {
            actionId,
            id,
            token,
            tags: draftFromState.tags.keySeq().toJS(),
            content: draftToPublish.content,
            entryType: entryTypes.findIndex(type => type === draftToPublish.content.entryType),
        });
    } catch (ex) {
        yield put(draftActions.draftPublishError(ex));
    }
}
/* eslint-enable max-statements */
function* draftPublishSuccess ({ data }) {
    const ethAddress = yield select(selectLoggedEthAddress);
    yield put(draftActions.draftDelete({ draftId: data.draft.id }));
    yield put(entryActions.entryProfileIterator({
        column: null,
        value: ethAddress,
        limit: 1000000,
        asDrafts: true
    }));
    const isUpdate = data.draft.id.startsWith('0x');
    yield put(appActions.showNotification({
        id: isUpdate ? 'newVersionPublishedSuccessfully' : 'draftPublishedSuccessfully',
        duration: 4,
        values: { title: data.draft.title }
    }));
}

function* draftPublishUpdate ({ actionId, draft }) {
    const channel = Channel.server.entry.editEntry;
    const { id } = draft;
    const draftFromState = yield select(state => selectDraftById(state, id));
    const token = yield select(selectToken);
    const ethAddress = yield select(selectLoggedEthAddress);
    const draftToPublish = draftFromState.toJS();
    try {
        draftToPublish.content.draft = JSON.parse(
            editorStateToJSON(draftFromState.getIn(['content', 'draft']))
        );
        yield call(enableChannel, channel, Channel.client.entry.manager);
        yield call([channel, channel.send], {
            ethAddress,
            actionId,
            entryId: id,
            token,
            tags: draftFromState.tags.keySeq().toJS(),
            content: draftToPublish.content,
            entryType: entryTypes.findIndex(type => type === draftToPublish.content.entryType)
        });
    } catch (ex) {
        yield put(draftActions.draftPublishUpdateError(ex));
    }
}

function* draftRevert ({ data }) {
    const { id, version } = data;
    const loggedEthAddress = yield select(selectLoggedEthAddress);
    yield put(entryActions.entryGetFull({
        entryId: id,
        version,
        asDraft: true,
        revert: true,
        ethAddress: loggedEthAddress,
    }));
    try {
        const resp = yield call([draftService, draftService.draftDelete], { draftId: id });
        yield put(draftActions.draftRevertToVersionSuccess({ id: resp }));
    } catch (ex) {
        yield put(draftActions.draftRevertToVersionError({ error: ex }));
    }
}

function* watchDraftPublishChannel () {
    while (true) {
        const response = yield take(actionChannels.entry.publish);
        const { actionId } = response.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
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
}

function* watchDraftPublishUpdateChannel () {
    while (true) {
        const response = yield take(actionChannels.entry.editEntry);
        const { actionId } = response.request;
        const shouldApplyChanges = yield call(isLoggedProfileRequest, actionId);
        if (shouldApplyChanges) {
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
    yield throttle(1500, types.DRAFT_UPDATE_SUCCESS, draftAutoSave);
    yield takeLatest(types.DRAFTS_GET, draftsGet);
    yield takeLatest(types.DRAFTS_GET_COUNT, draftsGetCount);
    yield takeEvery(types.DRAFT_DELETE, draftDelete);
    yield takeLatest(types.DRAFT_ADD_TAG, draftAddTag);
}
