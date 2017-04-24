import * as types from '../constants';
import { action } from './helpers';

export const errorDeleteFatal = id => action(types.ERROR_DELETE_FATAL, { id });
export const errorDeleteNonFatal = id => action(types.ERROR_DELETE_NON_FATAL, { id });
