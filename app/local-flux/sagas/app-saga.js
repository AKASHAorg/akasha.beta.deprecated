//@flow
import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/app-actions';
import * as types from '../constants';
import { profileSelectors } from '../selectors';
import * as settingsService from '../services/settings-service';
import ParserUtils from '../../utils/parsers/parser-utils';

/*::
    import type { Saga } from 'redux-saga';
 */

function* watchToggleOutsideNavigationModal ({ url })/* : Saga<void> */ {
    const loggedEthAddress = yield select(profileSelectors.selectLoggedEthAddress);
    const userSettings = yield call([settingsService, settingsService.userSettingsRequest],
        loggedEthAddress);
    const domain = ParserUtils.parseUrl(url).hostname;
    if (userSettings.trustedDomains && userSettings.trustedDomains.indexOf(domain) > -1) {
        yield put(actions.toggleOutsideNavigationRedirect(url));
    } else {
        yield put(actions.toggleOutsideNavigationSucccess(url));
    }
}

export function* watchAppActions ()/* : Saga<void> */ {
    yield takeEvery(types.TOGGLE_OUTSIDE_NAVIGATION_MODAL, watchToggleOutsideNavigationModal);
}
