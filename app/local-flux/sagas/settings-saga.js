import { apply, put } from 'redux-saga/effects';
import * as SettingsService from '../services/settings-service';
import * as actions from '../actions/settings-actions';

export function* getGeneralSettings () {
    yield put({ type: 'GENERAL_SETTINGS_REQUEST' });
    try {
        const resp = yield apply(SettingsService, SettingsService.getGeneralSettings);
        yield put(actions.generalSettingsSuccess(resp.data));
    } catch (error) {
        yield put(actions.generalSettingsError({ message: error.toString() }));
    }
}
