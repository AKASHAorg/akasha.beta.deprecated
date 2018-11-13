// @flow
import { createSelector } from 'reselect';

export const selectTempProfile = (state/*: Object */) => state.tempProfileState.get('tempProfile');

