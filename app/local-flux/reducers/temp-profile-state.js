import * as types from '../constants';
import { createReducer } from './create-reducer';
import { TempProfileModel } from './models';
import { genId } from '../../utils/dataModule';

const initialState = new TempProfileModel();

const tempProfileState = createReducer(initialState, {
    [types.TEMP_PROFILE_GET_SUCCESS]: (state, { data }) => {
        const { ...tempProfile } = data;
        return state.merge({
            tempProfile: state.get('tempProfile').merge(TempProfileModel.createTempProfile(tempProfile))
        });
    },

    // create a new temp profile for updates
    [types.SET_TEMP_PROFILE]: (state, { data }) =>
        state.merge({
            tempProfile: TempProfileModel.profileToTempProfile({
                localId: genId(),
                ...data.toJS()
            })
        }),

    [types.TEMP_PROFILE_UPDATE]: (state, { data }) =>
        state.mergeIn(['tempProfile'], data),


    [types.TEMP_PROFILE_DELETE]: state => state.clear(),
});

export default tempProfileState;
