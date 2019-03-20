import createSagaMiddleware from 'redux-saga';
import ChReqService from '../services/channel-request-service';
import * as actionService from '../services/action-service';
import * as claimableService from '../services/claimable-service';
import * as dashboardService from '../services/dashboard-service';
import * as draftService from '../services/dashboard-service';
import * as highlightService from '../services/highlight-service';
import * as listService from '../services/list-service';
import * as profileService from '../services/profile-service';
import * as registryService from '../services/registry-service';
import * as searchService from '../services/search-service';
import * as settingsService from '../services/settings-service';
import * as utilsService from '../services/utils-service';

const sagaMiddleware = createSagaMiddleware({
    context: {
        reqService: ChReqService,
        actionService,
        claimableService,
        dashboardService,
        draftService,
        highlightService,
        listService,
        profileService,
        registryService,
        searchService,
        settingsService,
        utilsService
    }
});

export default sagaMiddleware;
