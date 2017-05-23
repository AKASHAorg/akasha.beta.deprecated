import { selectGethStatus, selectIpfsStatus } from '../selectors';

// This may be needed in the future as a way to handle every response

const servicesMiddleware = store => next => (action) => {
    if (action.services) {
        const { geth, ipfs } = action.services;
        const gethStatus = selectGethStatus(store.getState());
        const ipfsStatus = selectIpfsStatus(store.getState());
        const gethChanged = geth &&
            (gethStatus.api !== geth.api || gethStatus.process !== geth.process);
        const ipfsChanged = ipfs &&
            (ipfsStatus.api !== ipfs.api || ipfsStatus.process !== ipfs.process);
        if (gethChanged || ipfsChanged) {
            // should dispatch services changed action
        }
    }
    return next(action);
};

export default servicesMiddleware;
