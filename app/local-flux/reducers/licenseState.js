import { LicenseState, LicenseDescription } from './records';
import * as types from '../constants';
import { createReducer } from './create-reducer';

const initialState = new LicenseState();

const licenseState = createReducer(initialState, {
    [types.LICENSE_GET_ALL_SUCCESS]: (state, { data }) => {
        let allIds = state.get('allIds');
        let byId = state.get('byId');
        data.licenses.forEach((license) => {
            allIds = allIds.add(license.id);
            byId = byId.set(license.id, new LicenseDescription(license));
        });
        return state.merge({
            allIds,
            byId,
        });
    },
});

export default licenseState;
