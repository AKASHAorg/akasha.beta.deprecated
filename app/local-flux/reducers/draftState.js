import { editorStateFromRaw } from 'megadraft';
import { DraftModel } from './models';
import { createReducer } from './create-reducer';
import { entryTypes } from '../../constants/entry-types';
import * as types from '../constants';

const initialState = new DraftModel();

const determineEntryType = (content) => {
    if (content.cardInfo && content.cardInfo.url) {
        return 'link';
    }
    return 'article';
};

const draftState = createReducer(initialState, {
    [types.DRAFT_CREATE_SUCCESS]: (state, { data }) =>
        state.merge({
            drafts: state.get('drafts').set(data.id, DraftModel.createDraft(data)),
            selection: state.get('selection').setIn([data.id, data.ethAddress], data.selectionState)
        }),

    [types.DRAFT_UPDATE_SUCCESS]: (state, { data }) =>
        state.merge({
            drafts: state.get('drafts').updateIn([data.draft.id], draft =>
                draft.merge(data.draft).set('saved', false)),
            selection: state.get('selection').setIn(
                [data.draft.id, data.draft.ethAddress],
                data.selectionState
            ),
        }),

    [types.DRAFTS_GET_SUCCESS]: (state, { data }) =>
        state.withMutations(stateMap =>
            stateMap.merge({ drafts: stateMap.get('drafts').merge(data.drafts) })
                .set('draftsFetched', true)
                .set('draftsCount', data.drafts.size)
        ),

    [types.DRAFT_AUTOSAVE]: (state, { data }) =>
        state.updateIn(['drafts', data.id], draft =>
            draft.merge({
                saved: false,
                saving: true
            })),

    [types.DRAFT_AUTOSAVE_SUCCESS]: (state, { data }) =>
        state.withMutations(stateMap =>
            stateMap.updateIn(['drafts', data.id], draft =>
                draft.merge({
                    saved: true,
                    saving: false,
                    localChanges: true,
                    updated_at: data.updated_at
                })).set('draftsCount', state.get('drafts').size)
        ),

    [types.DRAFT_GET_BY_ID_SUCCESS]: (state, { data }) =>
        state.setIn(['drafts', data.draft.id], data.draft),

    [types.DRAFTS_GET_COUNT_SUCCESS]: (state, { data }) => {
        if (data.count > 0) {
            return state.set('draftsCount', data.count);
        }
        return state.set('draftsFetched', true);
    },

    [types.DRAFT_DELETE_SUCCESS]: (state, { data }) =>
        state.merge({
            drafts: state.get('drafts').delete(data.draftId),
            draftsCount: state.get('drafts').delete(data.draftId).size,
            selection: state.get('selection').delete(data.draftId)
        }),

    // draft = { id, title, type }
    [types.DRAFT_PUBLISH]: (state, { draft }) =>
        state.setIn(['drafts', draft.id, 'publishing'], true),

    // data.draft
    [types.DRAFT_PUBLISH_SUCCESS]: (state, { data }) =>
        state.merge({
            drafts: state.get('drafts').delete(data.draft.id)
        }),

    [types.DRAFT_PUBLISH_UPDATE]: (state, { draft }) =>
        state.setIn(['drafts', draft.id, 'publishing'], true),

    [types.DRAFT_PUBLISH_UPDATE_SUCCESS]: (state, { data }) =>
        state.setIn(['drafts', data.draft.id, 'publishing'], false),

    [types.DRAFT_PUBLISH_ERROR]: (state, { draftId }) =>
        state.setIn(['drafts', draftId, 'publishing'], false),

    [types.DRAFT_PUBLISH_UPDATE_ERROR]: (state, { draftId }) =>
        state.setIn(['drafts', draftId, 'publishing'], false),

    [types.ENTRIES_GET_AS_DRAFTS_SUCCESS]: (state, { data }) =>
        /**
         * check if entry already in store, if it`s already in store,
         * check if entry version is up to date, if not update it.
         */
        state.withMutations((mState) => {
            data.collection.forEach((entry) => {
                /**
                 * if entry is not in store, add it
                 */
                if (!mState.getIn(['drafts', entry.entryId])) {
                    mState.setIn(['drafts', entry.entryId], DraftModel.createDraft({
                        content: {
                            ...entry.content,
                            entryType: entryTypes[entry.entryType],
                        },
                        onChain: true
                    }));
                } else {
                    mState.mergeIn(['drafts', entry.entryId], {
                        entryEth: entry.entryEth,
                        active: entry.active,
                        score: entry.score,
                        baseUrl: entry.baseUrl,
                        saved: true,
                        onChain: true
                    });
                }
                mState
                    .set('resolvingEntries', mState.get('resolvingEntries').push(entry.entryId));
            });
            mState.set('entriesFetched', true);
        }),
    [types.ENTRY_GET_FULL_AS_DRAFT_SUCCESS]: (state, { data }) => {
        const { entryId, content } = data;
        const existingDraft = state.getIn(['drafts', entryId]);
        return state.withMutations((mState) => {
            if (existingDraft && existingDraft.get('localChanges')) {
                mState.mergeIn(['drafts', entryId], {
                    content: mState.getIn(['drafts', entryId, 'content']).merge({
                        latestVersion: Math.max(
                            existingDraft.getIn(['content', 'latestVersion']), content.version
                        ),
                    })
                });
            }

            if ((existingDraft && !existingDraft.get('localChanges')) || data.revert) {
                const { draftParts, tags, ...newDraftContent } = content;
                mState.mergeIn(['drafts', entryId], DraftModel.createDraft({
                    ...existingDraft.toJS(),
                    content: {
                        ...newDraftContent,
                        draft: editorStateFromRaw(data.content.draft),
                        latestVersion: content.version,
                        entryType: content.entryType > -1 ?
                            entryTypes[content.entryType] :
                            determineEntryType(content),
                    },
                    saved: false,
                    localChanges: false,
                    tags,
                    id: entryId
                }));
            }
            mState.set('resolvingEntries',
                mState.get('resolvingEntries').delete(mState.get('resolvingEntries').indexOf(entryId))
            );
        });
    },
    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState,
});

export default draftState;
