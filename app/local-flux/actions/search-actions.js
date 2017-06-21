import { searchActionCreators } from './action-creators';
import { ProfileService, SearchService } from '../services';
import { action } from './helpers';
import * as types from '../constants';

let searchActions = null;
const MAX_RETRIES = 3;

class SearchActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (searchActions) {
            return searchActions;
        }
        this.profileService = new ProfileService();
        this.searchService = new SearchService();
        this.dispatch = dispatch;
        this.handshakeRetries = 0;
        searchActions = this;
    }

    handshake = () => {
        this.dispatch(searchActionCreators.handshake({ handshakePending: true }));
        this.searchService.handshake({
            onSuccess: (data) => {
                this.handshakeRetries = 0;
                this.dispatch(searchActionCreators.handshakeSuccess(data, {
                    handshakePending: false
                }));
            },
            onError: (error) => {
                const flag = this.handshakeRetries < MAX_RETRIES ?
                    {} :
                    { handshakePending: false };
                this.dispatch(searchActionCreators.handshakeError(error, flag));
                if (this.handshakeRetries < MAX_RETRIES) {
                    this.handshakeRetries += 1;
                    setTimeout(() => this.handshake(), 1000);
                }
            }
        });
    };

    query = (text) => {
        this.resetResults();
        this.dispatch(searchActionCreators.query(text, { queryPending: true }));
        this.searchService.query({
            text,
            onSuccess: data => {
                const akashaIds = [];
                data.collection && data.collection.forEach(entry => {
                    if (entry.entryEth.publisher && entry.entryEth.publisher.akashaId) {
                        akashaIds.push({ akashaId: entry.entryEth.publisher.akashaId });
                    }
                });
                this.profileService.saveAkashaIds(akashaIds);
                this.dispatch(searchActionCreators.querySuccess(data, {
                    queryPending: false
                }));
            },
            onError: error => this.dispatch(searchActionCreators.queryError(error, {
                queryPending: false
            }))
        });
    }

    moreQuery = (text, offset) => {
        this.dispatch(searchActionCreators.moreQuery(text, { moreQueryPending: true }));
        this.searchService.query({
            text,
            offset,
            onSuccess: data => {
                const akashaIds = [];
                data.collection && data.collection.forEach(entry => {
                    if (entry.entryEth.publisher && entry.entryEth.publisher.akashaId) {
                        akashaIds.push({ akashaId: entry.entryEth.publisher.akashaId });
                    }
                });
                this.profileService.saveAkashaIds(akashaIds);
                this.dispatch(searchActionCreators.moreQuerySuccess(data, {
                    moreQueryPending: false
                }));
            },
            onError: error => this.dispatch(searchActionCreators.moreQueryError(error, {
                moreQueryPending: false
            }))
        });
    }

    resetResults = () => this.dispatch(searchActionCreators.resetResults());
}

export { SearchActions };

export const searchHandshake = () => action(types.SEARCH_HANDSHAKE);
export const searchHandshakeSuccess = data => action(types.SEARCH_HANDSHAKE_SUCCESS, { data });
export const searchHandshakeError = () => action(types.SEARCH_HANDSHAKE_ERROR);

export const searchQuery = text => action(types.SEARCH_QUERY, { text });
export const searchQuerySuccess = data => action(types.SEARCH_QUERY_SUCCESS, { data });
export const searchQueryError = error => action(types.SEARCH_QUERY_ERROR, { error });

export const searchMoreQuery = text => action(types.SEARCH_MORE_QUERY, { text });
export const searchMoreQuerySuccess = data => action(types.SEARCH_MORE_QUERY_SUCCESS, { data });
export const searchMoreQueryError = error => action(types.SEARCH_MORE_QUERY_ERROR, { error });

export const searchResetResults = () => action(types.SEARCH_RESET_RESULTS);
