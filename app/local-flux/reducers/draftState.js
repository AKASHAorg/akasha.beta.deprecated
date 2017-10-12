import { Map } from 'immutable';
import { editorStateFromRaw } from 'megadraft';
import { DraftModel } from './models';
import { createReducer } from './create-reducer';
import * as types from '../constants';

const initialState = new DraftModel();

const draftState = createReducer(initialState, {
    [types.DRAFT_CREATE_SUCCESS]: (state, { data }) =>
        state.merge({
            drafts: state.get('drafts').set(data.id, DraftModel.createDraft(data)),
            selection: state.get('selection').setIn([data.id, data.ethAddress], new Map({
                selectionState: data.selectionState
            }))
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
            stateMap.merge({ drafts: data.drafts })
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
            draftsCount: state.get('drafts').delete(data.draftId).size
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
                        ...entry,
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
                    .set('resolvingHashes', mState.get('resolvingHashes').push(entry.entryEth.ipfsHash));
            });
            mState.set('entriesFetched', true);
        }),
    /**
     * At this point we have entry`s data but without the actual draft content.
     */
    [types.ENTRY_RESOLVE_IPFS_HASH_AS_DRAFTS_SUCCESS]: (state, { data }) =>
        state.withMutations((mState) => {
            const entryIpfsHash = data.ipfsHash;
            const targetEntry = mState.get('drafts')
                .valueSeq()
                .filter(entry =>
                    entry.onChain && entry.entryEth.ipfsHash === entryIpfsHash
                )
                .toList();
            if (targetEntry.size > 0) {
                targetEntry.forEach((entry) => {
                    const targetEntryId = entry.id;
                    const { content, ...otherDraftData } = mState.getIn(['drafts', targetEntryId]).toJS();
                    const { tags, draftParts, ...entryContent } = data.entry;
                    if (!otherDraftData.localChanges) {
                        const drft = {
                            content: {
                                ...entryContent,
                                draft: editorStateFromRaw(data.entry.draft),
                                version: entryContent.version,
                                latestVersion: entryContent.version
                            },
                            ...otherDraftData,
                            tags
                        };
                        mState.setIn(['drafts', targetEntryId], DraftModel.createDraft(drft));
                    }
                    /**
                     * entry content is already in store, so it`s a draft.
                     * update the entry version with the one which is published,
                     * in case of an edit from another computer.
                     */
                    mState.setIn(['drafts', targetEntryId, 'content', 'version'], data.entry.version)
                        .deleteIn(['resolvingHashes'], data.ipfsHash);
                });
            }
        }),
    [types.ENTRY_GET_FULL_AS_DRAFT_SUCCESS]: (state, { data }) => {
        const { entryId, content } = data;
        const existingDraft = state.getIn(['drafts', entryId]);
        if (existingDraft && existingDraft.get('content')) {
            const { draftParts, tags, ...otherDraftContent } = content;
            return state.setIn(['drafts', entryId], DraftModel.createDraft({
                ...existingDraft.toJS(),
                content: {
                    ...otherDraftContent,
                    draft: editorStateFromRaw(data.content.draft),
                    latestVersion: Math.max(
                        existingDraft.getIn(['content', 'latestVersion']), content.version
                    ),
                },
                saved: false,
                localChanges: false,
                tags
            }));
        }
        return state;
    }
});

export default draftState;
