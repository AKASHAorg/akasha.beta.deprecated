// @flow
import { call, put, select, takeEvery, takeLatest, throttle } from 'redux-saga/effects';
import { DraftJS, editorStateToJSON, editorStateFromRaw } from 'megadraft';
import { Map, OrderedMap } from 'immutable';
import { isEmpty } from 'ramda';
import { DraftModel } from '../reducers/models';
import { selectToken, selectDraftById, selectLoggedEthAddress } from '../selectors';
import { entryTypes } from '../../constants/entry-types';
import { getWordCount, extractExcerpt } from '../../utils/dataModule';
import { extractImageFromContent } from '../../utils/imageUtils';
import * as types from '../constants';
import * as claimableActions from '../actions/claimable-actions';
import * as draftService from '../services/draft-service';
import * as draftActions from '../actions/draft-actions';
import * as appActions from '../actions/app-actions';
import * as tagActions from '../actions/tag-actions';
import ChReqService from '../services/channel-request-service';
import { ENTRY_MODULE } from '@akashaproject/common/constants';


const { EditorState, SelectionState } = DraftJS;
/**
 * Draft saga
 */

/*:: 
    import type { Saga } from 'redux-saga';
 */

/**
 * create a new draft in state
 * the trick is to split selectionState from editorState
 * and to keep them synced
 */
function* draftCreate ({ data })/* : Saga<void> */ {
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

function* draftAddTag ({ data })/* : Saga<void> */ {
    yield put(tagActions.tagExists({ tagName: data.tagName, addToDraft: true, draftId: data.draftId }));
}

/**
 * get all drafts.
 */
function* draftsGet ({ data })/* : Saga<void> */ {
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
        yield put(draftActions.draftsGetError({ error: ex }));
    }
}

/**
 * save draft to db every x seconds
 */
function* draftAutoSave ({ data })/* : Saga<void> */ {
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
        yield put(draftActions.draftAutosaveError(
            { error: ex },
            data.draft.id,
            data.draft.content.title
        ));
    }
}

function* draftUpdate ({ data })/* : Saga<void> */ {
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

function* draftsGetCount ({ data })/* : Saga<void> */ {
    try {
        const response = yield call([draftService, draftService.draftsGetCount], {
            ethAddress: data.ethAddress
        });
        yield put(draftActions.draftsGetCountSuccess({ count: response }));
    } catch (ex) {
        yield put(draftActions.draftsGetCountError({ error: ex }));
    }
}

function* draftDelete ({ data })/* : Saga<void> */ {
    try {
        const response = yield call([draftService, draftService.draftDelete], { draftId: data.draftId });
        yield put(draftActions.draftDeleteSuccess({ draftId: response }));
    } catch (ex) {
        yield put(draftActions.draftDeleteError({ error: ex, draftId: data.draftId }));
    }
}
/* eslint-disable max-statements */
function* draftPublish ({ actionId, draft })/* : Saga<void> */ {
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
            const text = draftFromState.getIn(['content', 'draft']).getCurrentContent().getPlainText();
            if (text.length) {
                draftToPublish.content.excerpt = text.slice(0, 120);
            } else {
                draftToPublish.content.excerpt = draftToPublish.content.cardInfo.title;                
            }
        }
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
        yield call(
            [ChReqService, ChReqService.sendRequest],
            ENTRY_MODULE, ENTRY_MODULE.publish, {
                actionId, id, token,
                tags: draftFromState.tags.keySeq().toJS(),
                content: draftToPublish.content,
                entryType: entryTypes.findIndex(type => type === draftToPublish.content.entryType)
            }
        );
    } catch (ex) {
        yield put(draftActions.draftPublishError(ex));
    }
}
/* eslint-enable max-statements */
function* draftPublishSuccess ({ data })/* : Saga<void> */ {
    yield put(draftActions.draftDelete({ draftId: data.draft.id }));
    const isUpdate = data.draft.id.startsWith('0x');
    yield put(appActions.showNotification({
        id: isUpdate ? 'newVersionPublishedSuccessfully' : 'draftPublishedSuccessfully',
        duration: 4,
        values: { title: data.draft.title }
    }));
    yield put(claimableActions.claimableIterator());    
}

function* draftPublishUpdate ({ actionId, draft })/* : Saga<void> */ {
    const { id } = draft;
    const draftFromState = yield select(state => selectDraftById(state, id));
    const token = yield select(selectToken);
    const ethAddress = yield select(selectLoggedEthAddress);
    const draftToPublish = draftFromState.toJS();
    try {
        draftToPublish.content.draft = JSON.parse(
            editorStateToJSON(draftFromState.getIn(['content', 'draft']))
        );
        yield call(
            [ChReqService, ChReqService.sendRequest],
            ENTRY_MODULE, ENTRY_MODULE.editEntry, {
                ethAddress,
                actionId,
                entryId: id,
                token,
                tags: draftFromState.tags.keySeq().toJS(),
                content: draftToPublish.content,
                entryType: entryTypes.findIndex(type => type === draftToPublish.content.entryType)
            }
        );
    } catch (ex) {
        yield put(draftActions.draftPublishUpdateError(ex));
    }
}

function* draftRevert ({ data })/* : Saga<void> */ {
    const { id } = data;
    try {
        const resp = yield call([draftService, draftService.draftDelete], { draftId: id });
        yield put(draftActions.draftRevertToVersionSuccess({ id: resp }));
    } catch (ex) {
        yield put(draftActions.draftRevertToVersionError({ error: ex }));
    }
}

export function* watchDraftActions ()/* : Saga<void> */ {
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
