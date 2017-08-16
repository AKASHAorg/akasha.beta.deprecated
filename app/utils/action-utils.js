import * as actionStatus from '../constants/action-status';
import * as actionTypes from '../constants/action-types';

export const getInitialStatus = (type) => {
    const needAuth = [actionTypes.claim, actionTypes.comment, actionTypes.createTag, actionTypes.follow,
        actionTypes.profileRegister, actionTypes.profileUpdate, actionTypes.unfollow];
    const needTransferConfirm = [actionTypes.sendTip];
    const needWeightConfirm = [actionTypes.downvote, actionTypes.upvote];
    if (needAuth.includes(type)) {
        return actionStatus.needAuth;
    } else if (needTransferConfirm.includes(type)) {
        return actionStatus.needTransferConfirm;
    } else if (needWeightConfirm.includes(type)) {
        return actionStatus.needWeightConfirm;
    }
    return null;
};