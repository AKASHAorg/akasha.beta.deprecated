import { action } from './helpers';
import * as types from '../constants';

export const licenseGetAll = () => action(types.LICENSE_GET_ALL);

export const licenseGetAllError = (error) => {
    error.code = 'LGAE01';
    error.messageId = 'licenseGetAll';
    return action(types.LICENSE_GET_ALL_ERROR, { error });
};

export const licenseGetAllSuccess = data => action(types.LICENSE_GET_ALL_SUCCESS, { data });
