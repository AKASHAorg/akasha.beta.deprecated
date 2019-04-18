import LicenseStateModel, { LicenseDescription } from './state-models/license-state-model';
import { createReducer } from './utils';
import { LICENCE_MODULE } from '@akashaproject/common/constants';

const initialState = new LicenseStateModel();

const licenseState = createReducer(initialState, {
    [`${ LICENCE_MODULE.getLicences }_SUCCESS`]: (state, { data }) => {
        let allIds = state.get('allIds');
        let byId = state.get('byId');
        data.licences.forEach((license) => {
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
