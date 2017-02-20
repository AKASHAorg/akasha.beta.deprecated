import { searchActionCreators } from './action-creators';
import { ProfileService, SearchService } from '../services';

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
                    if (entry.entryEth.publisher.akashaId) {
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
                    if (entry.entryEth.publisher.akashaId) {
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
