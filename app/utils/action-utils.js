import * as actionStatus from '../constants/action-status';
import * as actionTypes from '../constants/action-types';

// TODO remove this after weight dialog is replaced with popover
export const getInitialStatus = (type) => {
    const needWeightConfirm = [actionTypes.downvote, actionTypes.upvote];
    if (needWeightConfirm.includes(type)) {
        return actionStatus.needWeightConfirm;
    }
    return actionStatus.needAuth;
};
