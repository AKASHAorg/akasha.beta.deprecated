import * as types from '../constants';
import { action } from './helpers';

export const tempProfileAbortSuccess = data => action(types.TEMP_PROFILE_ABORT_SUCCESS, { data });
export const tempProfileAbort = data => action(types.TEMP_PROFILE_ABORT, { data });

export const tempProfileCreate = data => action(types.TEMP_PROFILE_CREATE, { data });
export const tempProfileCreateSuccess = data => action(types.TEMP_PROFILE_CREATE_SUCCESS, { data });
export const tempProfileCreateError = error => action(types.TEMP_PROFILE_CREATE_ERROR, { error });

export const tempProfileDelete = () => action(types.TEMP_PROFILE_DELETE);
export const tempProfileDeleteSuccess = () => action(types.TEMP_PROFILE_DELETE_SUCCESS);
export const tempProfileDeleteError = error => action(types.TEMP_PROFILE_DELETE_ERROR, { error });

export const tempProfileGet = () => action(types.TEMP_PROFILE_GET);
export const tempProfileGetSuccess = () => action(types.TEMP_PROFILE_GET_SUCCESS, { data });
export const tempProfileGetError = () => action(types.TEMP_PROFILE_GET_ERROR, { error });

export const tempProfileLogin = data => action(types.TEMP_PROFILE_LOGIN, { data });
export const tempProfileLoginSuccess = data => action(types.TEMP_PROFILE_LOGIN_SUCCESS, { data });
export const tempProfileLoginError = error => action(types.TEMP_PROFILE_LOGIN_ERROR, { error });

export const tempProfilePublish = data => action(types.TEMP_PROFILE_PUBLISH, { data });
export const tempProfilePublishSuccess = data => action(types.TEMP_PROFILE_PUBLISH_SUCCESS, {
    data
});
export const tempProfilePublishError = error => action(types.TEMP_PROFILE_PUBLISH_ERROR, { error });

export const tempProfileRequest = () => action(types.TEMP_PROFILE_REQUEST);

export const tempProfileError = (error) => {
    error.code = 'TPRE01';
    error.messageId = 'tempProfileRequest';
    return action(types.TEMP_PROFILE_ERROR, { error });
};

export const tempProfileSuccess = data => action(types.TEMP_PROFILE_SUCCESS, { data });

export const ethAddressCreate = data => action(types.ETH_ADDRESS_CREATE, { data });
export const ethAddressCreateSuccess = data => action(types.ETH_ADDRESS_CREATE_SUCCESS, { data });
export const ethAddressCreateError = error => action(types.ETH_ADDRESS_CREATE_ERROR, { error });

export const faucetRequest = data => action(types.FUND_FROM_FAUCET, { data });
export const faucetRequestSuccess = data => action(types.FUND_FROM_FAUCET_SUCCESS, { data });
export const faucetRequestError = error => action(types.FUND_FROM_FAUCET_ERROR, { error });

export const tempProfileFaucetTxMined = data => action(types.TEMP_PROFILE_FAUCET_TX_MINED, {
    data
});
export const tempProfileFaucetTxMinedSuccess = data => action(
    types.TEMP_PROFILE_FAUCET_TX_MINED_SUCCESS, { data }
);

export const tempProfilePublishTxMined = () => action(types.TEMP_PROFILE_PUBLISH_TX_MINED);
export const tempProfilePublishTxMinedSuccess = data => action(
    types.TEMP_PROFILE_PUBLISH_TX_MINED_SUCCESS, { data }
);

